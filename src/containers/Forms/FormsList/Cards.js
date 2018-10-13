import React, { PureComponent, Fragment } from "react";
//Components
import { Button, Icon, Link } from "../../../components/atoms";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Graphic
} from "../../../components/molecules";
import CopyToClipboard from "react-copy-to-clipboard";
//Utils
import * as moment from "moment";
import { random, _getUsername } from "../../../services/utilities";
import { withAlert } from "react-alert";

const colors = ["#7568F0", "#8A75F3", "#A384F6", "#A384F6", "#CA9CFB"];
class Cards extends PureComponent {
  state = {
    url: `https://api.formette.com/${_getUsername()}/`
  };
  render() {
    const { data, alert } = this.props;
    if (Object.keys(data).length === 0) {
      return (
        <Graphic
          title="No search results"
          description="No form was found with the words in the search box. Try searching in other words."
          imgType="notfound"
          top={55}
        />
      );
    }
    return (
      <Fragment>
        {data.map(item => {
          return (
            <div
              key={item.id}
              className="col-12 col-sm-12 col-md-4 col-lg-3"
              style={{ marginBottom: "30px" }}
            >
              <Card>
                <CardHeader>
                  <h5
                    className="card-title text-truncate"
                    style={{ color: colors[random(0, 4)] }}
                  >
                    <Icon name="fas fa-file-alt" /> {item.name}
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <Icon name="fas fa-calendar text-muted" />{" "}
                    {moment(item.createdAt).format("ll")}
                  </h6>
                </CardHeader>
                <CardBody>
                  <Icon name="fas fa-database" />{" "}
                  {`${item._contentsMeta.count}`} reponses{" "}
                  <Link decoration="underline" href={`#/form/${item.id}`}>
                    View data
                  </Link>
                </CardBody>
                <CardFooter>
                  <div className="text-right">
                    <CopyToClipboard
                      text={`${this.state.url}${item.endpoint.split("/")[1]}`}
                      style={{ cursor: "pointer" }}
                      onCopy={() =>
                        alert.success("Endpoint copied to clipboard")
                      }
                    >
                      <Button className="btn btn-md btn-primary" primary>
                        <Icon name="fas fa-link" color="#FFF" /> Endpoint
                      </Button>
                    </CopyToClipboard>
                  </div>
                </CardFooter>
              </Card>
            </div>
          );
        })}
      </Fragment>
    );
  }
}

export default withAlert(Cards);
