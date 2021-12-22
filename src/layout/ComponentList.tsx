import { componentMap } from "@components";
import { List, Typography } from "antd";

const ComponentList = () => {
  const addComponent = (Component: any) => {
    new Component(undefined, true);
  };
  return (
    <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={Object.values(componentMap)}
      renderItem={(item) => (
        <List.Item
          actions={[
            <a key="list-loadmore-edit" onClick={() => addComponent(item)}>
              新增
            </a>,
          ]}
        >
          <Typography.Text>{item.cnName}</Typography.Text>
        </List.Item>
      )}
    />
  );
};
export default ComponentList;
