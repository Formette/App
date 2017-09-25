// @flow
//API
import { ALL_FORMS_QUERY } from "./Queries";

/*
* This file contains all the global functions and actions to the servers that are used on all the project
* */

//FORMS

//this functions deletes the selected form by the user
const deleteForm = async (id: string, userId: string, deleteFormMutation: any) => {
    //deletes the form in the DB
    try{
        await deleteFormMutation({
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
                    return e;
                }
            }
        });
        return true;
    }catch(e){
        console.error(e);
        return e;
    }
};

export {
    deleteForm
};
