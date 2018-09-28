import React, { PureComponent, Fragment } from "react";
//Components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter
} from "../../../components/molecules";
//Utils
import * as moment from "moment";

class Cards extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <Fragment>
        {data.map(item => {
          return (
            <Card width="250px" key={item.id}>
              <CardHeader>
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {moment(item.createdAt).format("ll")}
                </h6>
              </CardHeader>
              <CardBody>
                <i className="far fa-file-alt" />
              </CardBody>
              <CardFooter>
                <div className="d-flex justify-content-between">
                  <span>
                    <i className="fas fa-eye" />
                  </span>
                  <span>
                    <i className="fas fa-clone" />
                  </span>
                  <span>
                    <i className="fas fa-trash-alt" />
                  </span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </Fragment>
    );
  }
}

export default Cards;
