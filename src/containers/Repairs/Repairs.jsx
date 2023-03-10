import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import "./Repairs.css";
import {
  getBrands,
  getDevicesByBrand,
  getAllRepairs,
  newUserRepair,
} from "../../services/apiCalls";

function Repairs() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [devices, setDevices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const userToken = localStorage.getItem("token");
  const [userRepair, setUserRepair] = useState({
    device_id: "",
    imei: "",
    repair_id: "",
    description: "",
  });
  const [isValid, setIsValid] = useState(false);
  const [isSend, setIsSend] = useState(false);

  useEffect(() => {
    if (brands?.length === 0) {
      getBrands(userToken)
        .then((res) => {
          setBrands(res.data.data);
        })
        .catch((error) => {
          return;
        });
    }
    if (repairs?.length === 0) {
      getAllRepairs()
        .then((res) => {
          setRepairs(res.data.data);
        })
        .catch((error) => {
          return;
        });
    }
  }, []);

  useEffect(() => {
    let userRepairValidation = true;
    Object.values(userRepair).forEach((element) => {
      if (element === "") {
        userRepairValidation = false;
        setIsValid(false);
      }
    });
    if (userRepairValidation) {
      setIsValid(true);
    }
  }, [userRepair]);

  const brandHandler = (e) => {
    getDevicesByBrand(e.target.value)
      .then((res) => {
        setDevices(res.data.data);
      })
      .catch((error) => {
        return;
      });
  };

  const selectHandler = (e) => {
    setUserRepair((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = (e) => {
    setIsSend(true);
    newUserRepair(userRepair).then((res) => {
      setIsSend(false);
      navigate("/");
    }).catch((error) => {return});
  };

  return (
    <Container fluid className="min-vh-100 container-home align-items-center d-flex justify-content-center">
      <Row className="form-row p-0 p-md-5">
      <Row className="d-flex justify-content-center align-items-center pt-2">
        <Col className="col-9 col-md-5 p-0 p-md-2">
          <Form.Select
            className="text-center input-repair"
            onChange={(e) => {
              brandHandler(e);
            }}
          >
            <option value="">Select your branch</option>
            {brands?.map((brand, index) => {
              return (
                <option value={brand.brand} key={index}>
                  {brand.brand}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>

      <Row className="d-flex justify-content-center align-items-center pt-2">
        <Col className="col-9 col-md-5 p-1 p-md-2">
          <Form.Select
            className="text-center input-repair"
            name="device_id"
            onChange={(e) => {
              selectHandler(e);
            }}
          >
            <option value="">Select your device</option>
            {devices?.map((device, index) => {
              return (
                <option value={device?.id} key={index}>
                  {device?.model}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>
      <Row className="d-flex justify-content-center align-items-center pt-2">
        <Col className="col-9 col-md-5 p-1 p-md-2">
          <Form.Select
            className="text-center input-repair"
            name="repair_id"
            onChange={(e) => {
              selectHandler(e);
            }}
          >
            <option value="">Select your repair</option>
            {repairs?.map((repairs, index) => {
              return (
                <option value={repairs?.id} key={index}>
                  {repairs?.type}
                </option>
              );
            })}
          </Form.Select>
        </Col>
      </Row>

      <Row className="d-flex justify-content-center align-items-center ">
        <Col className="d-flex justify-content-center align-items-center pt-2">
          <input
            type="text"
            name="imei"
            onChange={(e) => selectHandler(e)}
            placeholder="IMEI"
            className="text-center col-9 col-md-5 input-repair p-1 p-md-2 imei-input"
          />
        </Col>
      </Row>
      <Row className="d-flex justify-content-center align-items-center ">
        <Col className="d-flex justify-content-center align-items-center pt-2">
          <textarea
            maxLength="40000"
            cols="20"
            rows="6"
            name="description"
            onChange={(e) => selectHandler(e)}
            placeholder="Write device problems"
            className="text-center col-9 col-md-5 text-area-description input-repair mb-2 p-1 p-md-2"
          />
        </Col>
      </Row>
      {isValid && !isSend && userToken && (
        <Row className="d-flex justify-content-center align-items-center ">
          <Col className="d-flex justify-content-center align-items-center pt-2">
            <button
              className="custom-btn btn-1"
              onClick={(e) => {
                submitHandler(e);
              }}
            >
              Submit
            </button>
          </Col>
        </Row>
      )}
      {isValid && !isSend && !userToken && (
        <Row className="d-flex justify-content-center align-items-center ">
          <Col className="d-flex justify-content-center align-items-center pt-2">
            <button
              className="custom-btn btn-1"
              onClick={(e) => {
                navigate('/login');
              }}
            >
              Submit
            </button>
          </Col>
        </Row>
      )}
      {isValid && isSend && (
        <Row className="d-flex justify-content-center align-items-center ">
          <Col className="d-flex justify-content-center align-items-center pt-2">
            <Spinner
              animation="border"
              className="spinner-load"
              variant="light"
            />
          </Col>
        </Row>
      )}
      </Row>
    </Container>
  );
}

export default Repairs;
