// @flow
import React, {PureComponent} from 'react';
import {withRouter} from 'react-router';
//Components
import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert';
import {SubTitle, Header, Button, Icon} from '../components/atoms/index';
import {HorizontalList, Table} from '../components/molecules/index';
//Styles
import Colors from '../styles/Colors';
//Utils
import {ALERT_OPTIONS} from '../services/Constants';

let items = [
    { name: 'Louise', age: 27, color: 'red', test: "hey" },
    { name: 'Margaret', age: 15, color: 'blue', test: "hey"},
    { name: 'Lisa', age:34, color: 'yellow', test: "hey"}
];

class FormDetails extends PureComponent{
    showAlert(type: string = "success", text: string = "Some Text", color: string = Colors.green, icon: string = "fa-link"){
        this.msg.show(text, {
            time: 3000,
            type: type,
            icon: <Icon name={icon} color={color}/>
        })
    }
    render(){
        return(
            <div>
                {this.props.params.id}
                <AlertContainer ref={a => this.msg = a} {...ALERT_OPTIONS} />
                <div className="row">
                    <div className="col-md-6 col-sm-6">
                        <SubTitle text="All the data for" color={Colors.text.secondary}/>
                        <Header text="Newsletter"/>
                    </div>
                    <div className="col-md-6 col-sm-6">
                        <HorizontalList className="float-right">
                            <li>
                                <CopyToClipboard text={"lalala"}
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
                            <div className="card-block">
                                <Table data={items}/>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(FormDetails);