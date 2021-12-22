import { Button, Form, Input, Modal } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const EditModal: React.FC<any> = ({ item }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formField, setFormField] = useState<any>({});

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formRef.current?.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onEdit = () => {
    const propObj: any = {};
    const getProps = (obj: any) => {
      Object.keys(obj).forEach((key: string) => {
        if (obj[key] && typeof obj[key] === "object") {
          getProps(obj[key]);
        } else {
          propObj[key] = typeof obj[key];
        }
      });
    };
    getProps(item.currentComponent?.getDefaultProps());
    setFormField(propObj);
  };

  const onFinish = (val: any) => {
    if (val) {
      Object.keys(val).forEach((key) => {
        if ((val[key] || val[key] === 0) && formField[key] === "number") {
          val[key] = Number(val[key]);
        }
      });
      item.currentComponent.changeProps(val);
    }
  };
  const formRef = useRef<any>(null);

  return (
    <>
      <Button
        type="link"
        size="small"
        onClick={(e) => {
          e.preventDefault();
          showModal();
          onEdit();
        }}
      >
        修改
      </Button>
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          {Object.keys(formField).map((key) => {
            return (
              <Form.Item key={key} label={key} name={key}>
                <Input type={formField[key]} />
              </Form.Item>
            );
          })}
        </Form>
      </Modal>
    </>
  );
};
export default EditModal;
