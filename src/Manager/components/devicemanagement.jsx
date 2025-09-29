import { Tabs } from "antd";
import SuppliersTab from "./supplierstab";
import DeviceReportsTab from "./devicereporttab";
import DeviceManagement from "./devicemanage";
import DeviceTypeManagement from "./devicetypemanage";
import MaintenanceHistory from "./MaintenanceHistory";

const { TabPane } = Tabs;

const DeviceManagementContent = () => {
  return (
    <Tabs defaultActiveKey="1">
      {/* Tab Nhà cung cấp */}
      <TabPane tab="Suppliers" key="1" destroyInactiveTabPane={true}>
        <SuppliersTab />
      </TabPane>

      <TabPane
        tab="Device Type Management"
        key="2"
        destroyInactiveTabPane={true}
      >
        <DeviceTypeManagement />
      </TabPane>

      <TabPane tab="Device Management" key="3" destroyInactiveTabPane={true}>
        <DeviceManagement />
      </TabPane>

      <TabPane tab="Device Reports" key="4" destroyInactiveTabPane={true}>
        <DeviceReportsTab />
      </TabPane>

      <TabPane tab="Maintenance History" key="5" destroyInactiveTabPane={true}>
        <MaintenanceHistory />
      </TabPane>
    </Tabs>
  );
};

export default DeviceManagementContent;
