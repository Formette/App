import React, {Component} from 'react';
//Components
import {Header} from '../components/atoms/index';
import {Placeholder, PlaceholderAnimation, Card} from '../components/molecules/index';

class MyForms extends Component{
    state = {
        loading: true,
        loadingTimeout: 0,
    };
    componentDidMount(){
        this.setState({
            loadingTimeout: setTimeout(_ => {this.setState({loading: false})}, 1000)
        });
    }
    componentWillUnmount(){
        clearTimeout(this.state.loadingTimeout);
    }
    _LoadingAnimationContent = _ => {
        const content = [];
            for(let i=0; i<=6; i++){
                content.push (<PlaceholderAnimation key={i}/>);
            }
        return content;
    };
    render(){
        const {loading} = this.state;
        return(
            <div className="row">
                <div className="col-md-12 col-sm-12 col">
                    <Header text="My Forms"/>
                    <Card icon="fa-plus"
                          title="New Form" date="Create from scratch"
                          onClick={() => this.props.router.push('/new')}
                          new/>
                        {(loading) ? this._LoadingAnimationContent() :
                            <div>
                                <Card title="Contact"
                                      date="Created on 12 Jun"
                                      onClick={() => this.props.router.push('/form/1')}/>
                                <Card title="Newsletter"
                                      date="Created on 12 Jun"
                                      onClick={() => this.props.router.push('/form/2')}/>

                                <Placeholder width={208} height={198}/>
                                <Placeholder width={208} height={198}/>
                                <Placeholder width={208} height={198}/>
                                <Placeholder width={208} height={198}/>
                                <Placeholder width={208} height={198}/>
                            </div>
                        }
                </div>
            </div>
        )
    }
}

export default MyForms;
