import React, { useState } from "react";
import { Subject } from "../../../services/SubjectService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

interface TERSubjectViewProps {
	subjects: Subject[];
	onAccept?: (subject: Subject) => void;
	onReject?: (subject: Subject) => void;
};

export default function TERSubjectView({subjects, onAccept, onReject}: TERSubjectViewProps){
	const [reject, setReject] = useState<Subject | null>(null);

	return (
		<>
			{reject &&
				<ConfirmationDialog label="Rejeter Sujet?" 
				onCancel={() => setReject(null)} 
				onConfirm={() => onReject?.(reject)}
				info={`Êtes-vous sûr de vouloir rejeter le sujet "${reject.title}"`}
				>
					
				</ConfirmationDialog>
			}

			{subjects && subjects.map(subject => (
				<SubjectWidget subject={subject} adminMode={true} 
				onAccept={() => onAccept?.(subject)}
				onReject={() => setReject(subject)}
				
				/>
			))}
		</>
	)
}