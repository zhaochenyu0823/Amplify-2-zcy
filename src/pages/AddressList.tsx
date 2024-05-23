import { useState, useEffect } from "react"; //useState 用于在组件中管理状态，useEffect 用于处理副作用（例如数据获取）。
import type { Schema } from "../../amplify/data/resource"; //Schema 是用于定义数据库模型的结构。
import { generateClient } from "aws-amplify/data"; //generateClient 可以用来与后端服务交互。

const client = generateClient<Schema>(); //这个客户端用于执行对数据库的操作，如读取和写入数据。

export default function AddressList () {
    const [addresses, setAddressList] = useState<Schema["UserAddress"]["type"][]>([]); // 更改变量名避免混淆
    const fetchAddress = async () => {
        const { data: items } = await client.models.UserAddress.list();
        setAddressList(items);


        client.models.UserAddress.observeQuery().subscribe({
            next: (data) => setAddressList([...data.items]),
          });
    };

    useEffect(() => { //useEffect 钩子在组件首次渲染时调用 
        fetchAddress();
    }, []);

    
    return (
      <div>
        <h1>Address List</h1>
        <ul>
        {addresses.map((ad) => (
          <li key={ad.userId}>名前: {ad.name}, 電話番号: {ad.phone}, 住所: {ad.address}</li>
        ))}
        </ul>    
    </div>
      
    );
  };
