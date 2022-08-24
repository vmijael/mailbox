// =================================================================
import {
  ref,
  onValue,
  child, push, update
} from "firebase/database";
import { Box, Divider } from "@mui/material";
import { ButtonComp } from "../components/ButtonComp";
import { TextareaComp } from "../components/TextareaComp";
import { db as FIRE_DB, dbName as DB_NAME } from "../app.config";
import { RadioboxGroupComp } from "../components/RadioboxGroupComp";
import { MUIButtonCompInterface } from "../common/interfaces/component.interface";
// =================================================================

//TODO: if time implement rxfire
let comment = '';
let feeling = '';

const comments = ref(FIRE_DB, `${DB_NAME}/`);

const muiButtonProps: MUIButtonCompInterface = {
  size: 'small',
  color: 'info',
  variant: 'outlined',
}

// TODO: protect with debounce from too many events
//TODO: WIP
const handleTextareaChange = (text: string) => { comment = text };
const handleRadioGroupChange = (optionChosen: string) => { feeling = optionChosen };

onValue(comments, (snapshot) => {
  let counter = 1;
  const data = snapshot.val();
  if (data) {
    for (let key in data) {
      console.log(`========== Comment ${counter} ==========`);
      console.log(`Message: ${data[key].message}`);
      console.log(`Feeling: ${data[key].feeling}`);
      console.log(`========== ========== ========== \n\n`);
      counter++;
    }
  }
});

//POST
function postComment() {
  const postData = {
    feeling,
    message: comment,
  };
  const updates: any = {};
  const newPostKey = push(child(ref(FIRE_DB), DB_NAME)).key;

  updates[`/${DB_NAME}/` + newPostKey] = postData;

  return update(ref(FIRE_DB), updates);
}

export function FeedbackComp() {
  return (
    <>
      <Box role="presentation">
        <div> <p> Tell us about your experience </p> </div>
        <Divider />
        <div>
          <RadioboxGroupComp
            handleChange={(e: any) => handleRadioGroupChange(e.target.value)}
          />

          <br />

          <TextareaComp
            title="Tell us why"
            handleChange={(e: any) => handleTextareaChange(e.target.value)}
          />

          <br />

          <ButtonComp
            text="Post Comment"
            mui={muiButtonProps}
            handleClick={() => { postComment() }} />
        </div>
      </Box>
    </>
  );
}