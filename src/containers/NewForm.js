// @flow
import React, {PureComponent} from 'react';
//Components
import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/styles';
import {SubTitle, Header, Input, Button, Text, Textarea, Icon, Switch, Link, Badge} from '../components/atoms/index';
//Styles
import Colors from '../styles/Colors';
//Utils
import {_getUsername, guid} from '../services/utilities';
import {ALERT_OPTIONS} from '../services/Constants';

const generateID = guid();
const generateEndpoint = `http://www.formette.com/api/${_getUsername()}/`;

class NewForm extends PureComponent {
    msg: any;
    state = {
        name: "",
        description: "",
        customEndpoint: "",
        disableForm: false,
        onModeEdit: false
    };
    showAlert(type: string = "success", text: string = "Some Text", color: string = Colors.green, icon: string = "fa-link"){
        this.msg.show(text, {
            time: 3000,
            type,
            icon: <Icon name={icon} color={color}/>
        })
    }
    render(){
        const {name, description, customEndpoint, disableForm, onModeEdit} = this.state;
        return(
            <div>
                <AlertContainer ref={a => this.msg = a} {...ALERT_OPTIONS} />
                <div className="row">
                    <div className={`col-md-${onModeEdit ? 9 : 12}`}>
                        <SubTitle text="New form" color={Colors.text.secondary}/>
                        <Header text={(name) ? name : generateID}/>
                    </div>
                    {onModeEdit ?
                        <div className="col-md-3">
                            <Badge className="float-right" text="Edit mode" bg={Colors.yellow}/>
                        </div> : null
                    }
                </div>
                <div className="row">
                    <div className="col-md-6" style={{marginTop: 30}}>
                        <form>
                                <div className="form-group">
                                    <SubTitle text="Name:" color={Colors.text.secondary}/>
                                    <Input placeholder="e.g: Newsletters"
                                           value={name}
                                           onChange={(e) => this.setState({name: e.target.value})}
                                           className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <SubTitle text="Description:" color={Colors.text.secondary}/>
                                    <Textarea className="form-control"
                                              placeholder="e.g: This is a Newsletters form for my personal website."
                                              value={description}
                                              onChange={(e) => this.setState({description: e.target.value})}
                                              rows="3"/>
                                </div>
                            <hr/>
                                <div className="form-group">
                                    <SubTitle text="Custom endpoint:" color={Colors.text.secondary}/>
                                    <Text text="You can choose a custom endpoint but note that the name has to be unique compared to your previously created forms."
                                          color={Colors.text.secondary}/>
                                    <Input placeholder="e.g: newsletters2017"
                                           value={customEndpoint}
                                           onChange={(e) => this.setState({customEndpoint: e.target.value})}
                                           className="form-control"/>
                                </div>
                            <Button color={Colors.primary} className="btn btn-lg btn-primary btn-block">{onModeEdit ? "Update" : "Save"} form</Button>
                        </form>
                    </div>
                    <div className="col-md-6" style={{marginTop: 30}}>
                        <div className="card">
                            <div className="card-block">
                                <div className="form-group">
                                    <SubTitle text="Endpoint:" color={Colors.text.secondary}/>
                                    <div className="input-group">
                                        <Input placeholder={`${generateEndpoint}${(customEndpoint) ? customEndpoint : generateID}`} className="form-control" style={{margin: 0}} readOnly/>
                                        <CopyToClipboard text={`${generateEndpoint}${(customEndpoint) ? customEndpoint : generateID}`}
                                                         style={{cursor: "pointer"}}
                                                         onCopy={_ => this.showAlert("success", "Endpoint copied to clipboard")}>
                                            <div className="input-group-addon">
                                                <Icon name="fa-clipboard" size={16}/>
                                            </div>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                                <hr/>
                                <div>
                                    <SubTitle text="Sample:" color={Colors.text.secondary}/>
                                    <Text text="Copy and paste the example of the form below into your project, change its content according to your needs."
                                          color={Colors.text.secondary}/>
                                    <SyntaxHighlighter language='javascript' style={docco}>
                                        {'<form action="'+generateEndpoint+'" method="post" target="_blank">\n' +
                                        '  <input type="text" name="email" placeholder="Email" />\n' +
                                        '  <input type="text" name="message" placeholder="Message" />\n' +
                                        '  <button class="button" type="submit">Submit</button>\n' +
                                        '</form>'}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>
                        <div className="card" style={{marginTop: 10}}>
                            <div className="card-block">
                                    <SubTitle text="Disable form submissions:" color={Colors.text.secondary}/>
                                    <Switch onChange={(value) => this.setState({disableForm: value})}
                                            value={disableForm}/>
                                {onModeEdit ?
                                    <div>
                                        <hr/>
                                        <SubTitle text="Settings:" color={Colors.text.secondary}/>
                                        <ul className="list-inline">
                                            <li><Link color={Colors.red}>Delete form</Link></li>
                                        </ul>
                                    </div>: null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewForm;