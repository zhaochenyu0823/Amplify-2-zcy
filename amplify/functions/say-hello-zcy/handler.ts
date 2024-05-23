import { Handler } from 'aws-lambda';
import { generateClient } from "aws-amplify/data"; //generateClient 可以用来与后端服务交互。
import { Schema } from '../../data/resource';
const client = generateClient<Schema>(); //这个客户端用于执行对数据库的操作，如读取和写入数据。

export const handler: Handler = async (event, context) => {

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    // 执行 Scan 操作以获取表中所有数据
    const { data: items } = await client.models.UserAddress.list();

    return {
      statusCode: 200,
      body: JSON.stringify(items),
      headers
    };
  } catch (err) {
    console.error('Error fetching data from DynamoDB', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err}),
      headers
    };
  }
};