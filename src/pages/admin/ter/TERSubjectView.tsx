import React, { useState } from "react";
import { Subject } from "../../../services/SubjectService";
import SubjectWidget from "../../../components/objects/SubjectWidget";
import ConfirmationDialog from "../../../components/dialog/ConfirmationDialog";

interface TERSubjectViewProps {
	subjects: Subject[];
	readOnly?: boolean;
	onAccept?: (subject: Subject) => void;
	onReject?: (subject: Subject) => void;
};

export default function TERSubjectView({ subjects, readOnly, onAccept, onReject }: TERSubjectViewProps) {
	const [reject, setReject] = useState<Subject | null>(null);

	return (
		<>
			{reject &&
				<ConfirmationDialog label="Rejeter Sujet?"
					onCancel={() => setReject(null)}
					onConfirm={() => { onReject?.(reject); setReject(null); }}
					info={`Êtes-vous sûr de vouloir rejeter le sujet "${reject.title}"`}
				>
				
				</ConfirmationDialog>
			}

			{subjects && subjects.map(subject => (
				<SubjectWidget key={subject.id} subject={subject} adminMode={!readOnly}
					onAccept={!readOnly ? () => onAccept?.(subject) : undefined}
					onReject={!readOnly ? () => setReject(subject) : undefined}
				/>
			))}
		</>
	)
}