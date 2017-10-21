// @flow
//API
import { ALL_FORMS_QUERY } from "./Queries";
//Utilities
import { _saveUsername, _saveUserId } from "../services/utilities";
import LogRocket from 'logrocket';

/*
* This file contains all the global functions and actions to the servers that are used on all the project
* */

//USER

//this functions login in the user
const userSignIn = async (
    email: string,
    password: string,
    signinUser: any,
) => {
    try{
        await signinUser({
           variables: {
               email,
               password
           },
           update: (store, { data: { signinUser } }) => {
               try{
                   window.localStorage.setItem(
                       "graphcoolToken",
                       signinUser.token
                   );
                   _saveUsername(signinUser.user.userName);
                   _saveUserId(signinUser.user.id);
                   //LogRocket
                   LogRocket.identify(signinUser.user.id, {
                       name: signinUser.user.userName,
                       email: signinUser.user.email,
                   });
               }catch(e){
                   console.error(e);
                   return e;
               }
           }
        });
        return true;
    }catch(e){
        console.error(e);
        return false;
    }
};

//FORMS

//this functions deletes the selected form by the user
const deleteForm = async (
  id: string,
  userId: string,
  deleteFormMutation: any
) => {
  //deletes the form in the DB
  try {
    await deleteFormMutation({
      variables: {
        id
      },
      update: (store, { data: { deleteForms } }) => {
        try {
          //reads the query from the cache
          const data = store.readQuery({
            query: ALL_FORMS_QUERY,
            variables: { userId }
          });
          //finds and removes the form from the object
          data.allFormses.forEach((value, index) => {
            if (value.id === deleteForms.id) {
              data.allFormses.splice(index, 1);
            }
          });
          //updates the new data to the store
          store.writeQuery({
            query: ALL_FORMS_QUERY,
            variables: { userId },
            data
          });
        } catch (e) {
          LogRocket.error({'deleteForm': e});
          console.error(e);
          return e;
        }
      }
    });
    return true;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export { deleteForm, userSignIn };
