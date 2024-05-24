import { useState, useEffect } from "react"; //useState 用于在组件中管理状态，useEffect 用于处理副作用（例如数据获取）。
import type { Schema } from "../../amplify/data/resource"; //Schema 是用于定义数据库模型的结构。
import { generateClient } from "aws-amplify/data"; //generateClient 可以用来与后端服务交互。
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth'

const client = generateClient<Schema>(); //这个客户端用于执行对数据库的操作，如读取和写入数据。

export default function AddressList() {
  const [addresses, setAddressList] = useState<Schema["UserAddress"]["type"][]>([]); // 更改变量名避免混淆
  const [data, setData] = useState(null);


  const fetchAddress = async () => {
    const { data: items } = await client.models.UserAddress.list();
    setAddressList(items);
    client.models.UserAddress.observeQuery().subscribe({
      next: (data) => setAddressList([...data.items]),
    });


  };
  const fetchData = async () => {
    try {

      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      console.log(token);  

      const response = await axios.get('https://qj930d5n79.execute-api.ap-northeast-1.amazonaws.com/prod/items', {
        headers: {
          Authorization: `Bearer ${token }`
        }
      });
      setData(response.data);
      console.log(response.data);  // 处理你的数据
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };



  useEffect(() => { //useEffect 钩子在组件首次渲染时调用 
    fetchAddress();
    fetchData();
  }, []);


  return (
    <div>
      <h1>Address List</h1>
      <ul>
        {addresses.map((ad) => (
          <li key={ad.userId}>名前: {ad.name}, 電話番号: {ad.phone}, 住所: {ad.address}</li>
        ))}
      </ul>


      <div>
        <h1>Data from API</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>

  );
};
