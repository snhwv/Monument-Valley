import { Col, Row, Tabs } from "antd";
import ComponentList from "./ComponentList";
import SceneTree from "./SceneTree";
import Three from "./Three";

const { TabPane } = Tabs;
function Layout() {
  return (
    <Row className={"full"}>
      <Col span={4} className={"fullHeight"}>
        <Tabs defaultActiveKey="1" className={"fullHeight"}>
          <TabPane
            tab="Tab 1"
            key="1"
            className={"fullHeight"}
            style={{ overflow: "auto" }}
          >
            <SceneTree></SceneTree>
          </TabPane>
          <TabPane
            tab="Tab 2"
            key="2"
            className={"fullHeight"}
            style={{ overflow: "auto" }}
          >
            <ComponentList></ComponentList>
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
