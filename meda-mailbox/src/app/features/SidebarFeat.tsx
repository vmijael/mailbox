// ===================================================================
import { Dispatch } from "redux";
import { useSelector } from "react-redux";
import { SearchMailFeat } from "./SearchMailFeat";
import { ButtonComp } from "../components/ButtonComp";
import { MUI_ERROR_BUTTON, MUI_INFO_BUTTON } from "../common/constants/button.constant";
// import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { fetchSpecificMessageThunk } from "../common/store/thunks/mailbox.thunk";
import { useMessageAsRead, useMessageRemoval } from "../common/hooks/mailbox.hook";
import { MailboxInterface, MailboxMessagesInterface, MUIButtonCompInterface } from "../common/interfaces";
// ===================================================================

let messages: any[];
let mailboxDispatch: Dispatch<any>;
let removeMessageDispatch: (messageID: string) => Dispatch<any>;
let markMessageReadDispatch: (messageID: string) => Dispatch<any>;

const handleMarkMessageAsRead = (messageID: string) => markMessageReadDispatch(messageID);
const handleRemovalOfSpecificMessage = (messageID: string) => removeMessageDispatch(messageID);
const handleDisplayOfSpecificMessage = (messageID:string, categoryID: string) => mailboxDispatch(fetchSpecificMessageThunk(messageID, categoryID));

// const rows: GridRowsProp = [
// 	{ id: 1, col1: 'Hello', col2: 'World' },
// 	{ id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
// 	{ id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

// const columns: GridColDef[] = [
// 	{ field: 'col1', headerName: 'Column 1', width: 150 },
// 	{ field: 'col2', headerName: 'Column 2', width: 150 },
// ];

export function SidebarFeat() {
	[, markMessageReadDispatch] = useMessageAsRead();
	[mailboxDispatch, removeMessageDispatch] = useMessageRemoval();

	messages = useSelector((state: MailboxInterface) => state.messages);

	return (
		<div>
			<SearchMailFeat />
			
			{messages.map((message: MailboxMessagesInterface, index: number) => {
				return (
					<div key={index} style={ { backgroundColor: message.read ? 'white' : 'yellow' } }>
						<hr />
						Subject: {message.subject}
						<br />
						Preview: {message.preview}
						<br />
						<ButtonComp 
							text='Show Message'
							mui={MUI_INFO_BUTTON}
							handleClick={() => handleDisplayOfSpecificMessage(message.id, message.subject)}
							/>
						<ButtonComp
							text='Delete'
							mui={MUI_ERROR_BUTTON} 
							handleClick={ () => handleRemovalOfSpecificMessage(message.id) }
							/>
						<ButtonComp
							text='Mark as Read' 
							mui={MUI_INFO_BUTTON}
							handleClick={() => handleMarkMessageAsRead(message.id) }
							/>
						<hr />
					</div>
				);
			})}

			<hr />

			{/* <div style={{ height: 300, width: '100%' }}>
				<DataGrid rows={rows} columns={columns} />
			</div> */}
		</div>
	);
}