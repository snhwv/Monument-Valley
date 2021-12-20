import { componentMap } from "@components";
import { List, Typography } from "antd";

const ComponentList = () => {
  const addComponent = (key: string) => {
    new componentMap[key]();
  };
  return (
    <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={Object.keys(componentMap)}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit" onClick={() => addComponent(item)}>
              新增
            </a>,
          ]}
        >
          <Typography.Text>{item}</Typography.Text>
        </List.Item>
      )}
    />
  );
};
export default ComponentList;
