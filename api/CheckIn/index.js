const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
    const tableClient = TableClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING,
        "attendance"
    );

    try {
        const userId = req.headers['x-ms-client-principal-id'] || 'user1'; // デモ用
        const userName = req.headers['x-ms-client-principal-name'] || 'テストユーザー';
        const now = new Date();
        
        const entity = {
            partitionKey: userId,
            rowKey: `${now.toISOString()}_checkin`,
            userId: userId,
            userName: userName,
            checkInTime: now.toISOString(),
            date: now.toISOString().split('T')[0],
            type: "CHECK_IN"
        };

        await tableClient.createEntity(entity);

        context.res = {
            status: 200,
            body: {
                success: true,
                message: "出勤打刻完了",
                checkInTime: now.toISOString()
            }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { success: false, error: error.message }
        };
    }
};
