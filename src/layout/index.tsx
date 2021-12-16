import { Col, Row, Tabs } from "antd";
import SceneTree from "./SceneTree";
import Three from "./Three";

const { TabPane } = Tabs;
function Layout() {
  return (
    <Row className={"full"}>
      <Col span={4}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tab 1" key="1">
            <SceneTree></SceneTree>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Col>
      <Col span={20}>
        <Three></Three>
      </Col>
    </Row>
  );
}

export default Layout;
