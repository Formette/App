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
import { _getUsername, _refreshPage, _getUserId} from "../services/utilities";
//API
import { FORM_DATA_QUERY, ALL_FORMS_QUERY } from "../api/Queries";
import { DELETE_FORM_MUTATION } from "../api/Mutations";
import { FORM_DATA_SUBSCRIPTION } from "../api/Subscriptions";

const url = `api.formette.com/${_getUsername()}/`;

class FormDetails extends PureComponent{
    msg: any;
    props: {
        formDataQuery: any,
        deleteFormMutation: any,
    };
    componentWillMount() {
        this._subscribeToNewLinks();
    }
    _subscribeToNewLinks = () => {
        this.props.formDataQuery.subscribeToMore({
            document: FORM_DATA_SUBSCRIPTION,
            variables: { id: this.props.match.params.id },
            updateQuery: (previous, { subscriptionData }) => {
                console.log("subscriptionData = ", subscriptionData);
                console.log("previous = ", previous);
                const newItems = [
                    subscriptionData.data.Forms.node.data,
                    ...previous.Forms.data
                ];
                const result = {
                    ...previous,
                    data: newItems
                };
                return result
            }
        });
    };
    showAlert(type: string = "success", text: string = "Some Text", color: string = Colors.green, icon: string = "fa-link"){
        this.msg.show(text, {
            time: 3000,
            type: type,
            icon: <Icon name={icon} color={color}/>
        })
    }
    _deleteForm = async () => {
        //deletes the form in the DB
        try{
            const {id} = this.props.match.params;
            const userId = _getUserId();
            await this.props.deleteFormMutation({
                variables: {
                    id,
                },
                update: (store, { data: {deleteForms} }) => {
                    try {
                        //reads the query from the cache
                        const data = store.readQuery({ query: ALL_FORMS_QUERY, variables: {userId: userId} });
                        //finds and removes the form from the object
                        data.allFormses.forEach((value, index) => {
                            if (value.id === deleteForms.id) {
                                data.allFormses.splice(index, 1);
                            }
                        });
                        //updates the new data to the store
                        store.writeQuery({ query: ALL_FORMS_QUERY, variables: {userId: userId}, data });
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
            //Shows feedback and updates the store
            //this.showAlert("success", "Form created successfully");
            this.props.history.push("/");
        }catch(e){
            console.error(e);
        }
    };
    _editForm = _ => {
        this.props.history.push(`/edit/${this.props.match.params.id}`)
    };
    render(){
        console.log("data = ",this.props.formDataQuery);
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
        const point = endpoint.split("/");
       // const point = "teste";
        return(
            <div>
                <AlertContainer ref={a => this.msg = a} {...ALERT_OPTIONS} />
                <div className="row">
                    <div className="col-md-6 col-sm-6">
                        <SubTitle text="All the data for" color={Colors.text.secondary}/>
                        <Header className="text-truncate" text={name}/>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <HorizontalList className="float-right">
                            <li>
                                <CopyToClipboard text={`${url}${point[1]}`}
                                                 style={{cursor: "pointer"}}
                                                 onCopy={_ => this.showAlert("success", "Endpoint copied to clipboard")}>
                                    <Button className="btn" color={Colors.default}>
                                        <Icon color={Colors.white} name="fa-link"/>
                                    </Button>
                                </CopyToClipboard>
                            </li>
                            <li>
                                <Button className="btn" color={Colors.default} onClick={this._editForm}>
                                    <Icon color={Colors.white} name="fa-pencil"/>
                                </Button>
                            </li>
                            <li>
                                <Button className="btn" color={Colors.red} onClick={this._deleteForm}>
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
    }),
    graphql(DELETE_FORM_MUTATION, { name: "deleteFormMutation" })
)(FormDetails);

export default FormDetailsWithData;