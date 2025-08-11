const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const tableClient = TableClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
        "attendance"
    );

    try {
        const userId = req.headers['x-ms-client-principal-id'] || 'user1'; // デモ用
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // 本日の出勤記録を確認
        const checkInQuery = `PartitionKey eq '${userId}' and date eq '${today}' and type eq 'CHECK_IN'`;
        const checkInRecords = tableClient.listEntities({
            queryOptions: { filter: checkInQuery }
        });

        let checkInTime;
        for await (const record of checkInRecords) {
            checkInTime = record.checkInTime;
            break;
        }

        if (!checkInTime) {
            context.res = {
                status: 400,
                body: { success: false, message: "本日の出勤記録がありません" }
            };
            return;
        }

        // 勤務時間計算
        const start = new Date(checkInTime);
        const end = new Date(now);
        const workHours = Math.round(((end - start) / (1000 * 60 * 60)) * 100) / 100;

        // 退勤記録を作成
        const entity = {
            partitionKey: userId,
            rowKey: `${now.toISOString()}_checkout`,
            userId: userId,
            checkOutTime: now.toISOString(),
            checkInTime: checkInTime,
            date: today,
            type: "CHECK_OUT",
            workHours: workHours
        };

        await tableClient.createEntity(entity);

        context.res = {
            status: 200,
            body: {
                success: true,
                message: "退勤打刻完了",
                workHours: workHours
            }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { success: false, error: error.message }
        };
    }
};
