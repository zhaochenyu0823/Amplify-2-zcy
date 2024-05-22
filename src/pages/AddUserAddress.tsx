import { useState} from "react"; //useState 用于在组件中管理状态，useEffect 用于处理副作用（例如数据获取）。
import type { Schema } from "../../amplify/data/resource"; //Schema 是用于定义数据库模型的结构。
import { generateClient } from "aws-amplify/data"; //generateClient 可以用来与后端服务交互。

const client = generateClient<Schema>(); //这个客户端用于执行对数据库的操作，如读取和写入数据。

export default function AddUserAddress() {

  const [formData, setFormData] = useState<Schema["UserAddress"]["type"]>({
    userId: '',
    name: '',
    phone: '',
    address: '',
    createdAt: '', 
    updatedAt: ''  
  });
  
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // 防止表单自动提交
    try {
      await client.models.UserAddress.create(formData);
      alert('Address saved successfully!');
      setFormData({
        userId: '', 
        name: '', 
        phone: '', 
        address: '',
        createdAt: '', 
        updatedAt: ''
      });
      // 重置表单
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Failed to save the address.');
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value || ""  
    }));
  };

  return (
    <div>
      <h1>AddAddress</h1>


      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          placeholder="User ID"
        />
        <input
          type="text"
          name="name"
          value={formData.name || ""} 
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone|| ""}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={formData.address|| ""}
          onChange={handleChange}
          placeholder="Address"
        />

        <button type="submit">Submit</button>
      </form>
    </div>

  );
};
