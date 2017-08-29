import React from 'react';
//Components
import {Header, Icon, Button, Text} from '../components/atoms/index';
//Styles
import styled from 'styled-components';
import Colors from '../styles/Colors';

const NoMatch = (props) => {
    return(
       <div className={`container ${props.className}`}>
           <div className="row">
               <div className="col-md-6 col-sm-12 text-center">
                   <Icon size={350} name="fa-exclamation-triangle" color={Colors.text.secondary}/>
               </div>
               <div className="col-md-6 col-sm-12">
                   <Header text="404" color={Colors.primary}/>
                   <Text text="Omg 😣 No form found to fill! The page you are trying to find is not available" color={Colors.text.secondary}/>
                   <Button className="btn btn-lg btn-primary"
                           color={Colors.primary}
                           onClick={_ => props.history.push('/')}>
                       Go back home
                   </Button>
               </div>
           </div>
       </div>
    )
};

const NoMatchWithStyles = styled(NoMatch)`
    position: relative;
    top: 150px;
    h2{
        font-size: 150px
    }
    p{
        font-size: 20px;
        width: 350px;
    }
    
    @media (max-width: 465px) {
        text-align: center;
		i {
		    font-size: 200px;
		}
		p {
		    width: 100%;
		}
	}
`;

export default NoMatchWithStyles;
