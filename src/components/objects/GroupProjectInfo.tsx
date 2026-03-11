import React from "react";
import "./GroupProjectInfo.css"
import { Group } from "../../services/GroupService";
import { Subject } from "../../services/SubjectService";
import SubjectWidget from "./SubjectWidget";

interface GroupProjectInfoProps {
	group: Group;
	subject: Subject | null;
};	

export default function GroupProjectInfo({group, subject}: GroupProjectInfoProps) {
	return (
		<>
			{subject && 
				<>
					<SubjectWidget subject={subject} privateMode={false} adminMode={false}/>
				</> 
			}
		</>
	)
}