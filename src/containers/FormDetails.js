// @flow
import React, {PureComponent} from 'react';
import { graphql, compose } from "react-apollo";
//Components
import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert';
import {SubTitle, Header, Button, Icon} from '../components/atoms/index';
import {HorizontalList, Table, Graphic} from '../components/molecules/index';
//Styles
import Colors from '../styles/Colors';
//Utils
import {ALERT_OPTIONS} from '../services/Constants';
import { _getUsername, _refreshPage} from "../services/utilities";
//API
import { FORM_DATA_QUERY } from "../api/Queries";

const url = `api.formette.com/${_getUsername()}/`;

class FormDetails extends PureComponent{
    msg: any;
    props: {
        formDataQuery: any,
    };
    showAlert(type: string = "success", text: string = "Some Text", color: string = Colors.green, icon: string = "fa-link"){
        this.msg.show(text, {
            time: 3000,
            type: type,
            icon: <Icon name={icon} color={color}/>
        })
    }
    render(){
        if (this.props.formDataQuery && this.props.formDataQuery.loading) {
            return <div>Loading</div>;
        }
        if (this.props.formDataQuery && this.props.formDataQuery.error) {
            return <Graphic text="Ups! Something went wrong try again." icon="fa-plug">
                        <Button className="btn btn-lg btn-primary"
                                color={Colors.primary}
                                onClick={_refreshPage}>
                            Try Again
                        </Button>
                   </Graphic>
        }
        if (this.props.formDataQuery.Forms === null) {
            return <Graphic
                        text="Hello Indiana Jones, are you in unfamiliar lands? You are a great explorer but this form does
                              not exist and may contain mysterious dangers. Come back home."
                        >
                    <Button className="btn btn-lg btn-primary"
                            color={Colors.primary}
                            onClick={_ => this.props.history.push('/')}>
                        Go back home
                    </Button>
                </Graphic>
        }
        const {data: items, name, endpoint} = this.props.formDataQuery.Forms;
        return(
            <div>
                <AlertContainer ref={a => this.msg = a} {...ALERT_OPTIONS} />
                <div className="row">
                    <div className="col-md-6 col-sm-6">
                        <SubTitle text="All the data for" color={Colors.text.secondary}/>
                        <Header text={name}/>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <HorizontalList className="float-right">
                            <li>
                                <CopyToClipboard text={`${url}${endpoint}`}
                                                 style={{cursor: "pointer"}}
                                                 onCopy={_ => this.showAlert("success", "Endpoint copied to clipboard")}>
                                    <Button className="btn" color={Colors.default}>
                                        <Icon color={Colors.white} name="fa-link"/>
                                    </Button>
                                </CopyToClipboard>
                            </li>
                            <li>
                                <Button className="btn" color={Colors.default}>
                                    <Icon color={Colors.white} name="fa-pencil"/>
                                </Button>
                            </li>
                            <li>
                                <Button className="btn" color={Colors.red}>
                                    <Icon color={Colors.white} name="fa-trash-o"/>
                                </Button>
                            </li>
                        </HorizontalList>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                {Object.keys(items).length === 0 ?
                                    <div>This form is so sad ... You do not have any submissions yet, help it, go! Look for data for this poor guy.</div>
                                    :
                                    <Table data={items}/>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const FormDetailsWithData = compose(
    graphql(FORM_DATA_QUERY, { name: "formDataQuery",
        options: (props) => ({
            variables: {id: props.match.params.id}
        })
    })
)(FormDetails);

export default FormDetailsWithData;