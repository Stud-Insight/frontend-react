import React, {useState} from "react";
import { Group } from "../../../services/GroupService";
import GroupProjectWidget from "../../../components/objects/GroupProjectWidget";
import Button from "../../../atoms/input/Button";
import { FaPlus } from "react-icons/fa";
import ModalDialog from "../../../components/dialog/ModalDialog";
import InputField from "../../../components/input/InputField";
import InputNumberField from "../../../components/input/InputNumberField";

interface TERGroupViewProps {
	groups: Group[];
	onAdd?: (nom: string, size: number) => void;
};

export default function TERGroupView({groups, onAdd}: TERGroupViewProps){
	const [addingGroup, setAddingGroup] = useState<boolean>(false);
	const [groupNom, setGroupNom] = useState<string>("");
	const [groupTaille, setGroupTaille] = useState<number>(2);

	const addGroupHandle = () => {
		onAdd?.(groupNom, groupTaille);
		setGroupNom("");
		setGroupTaille(2);
	};

	return (
		<>
			{addingGroup &&
				<ModalDialog label="Creation Groupe" onClose={() => setAddingGroup(false)}>
					<InputField label="Nom" value={groupNom} onChange={setGroupNom}/>
					<InputNumberField label="Taille" value={groupTaille} onChange={setGroupTaille} min={0} max={4}/>
					<Button label="Confirmer" onClick={addGroupHandle}/>
				</ModalDialog>
			}

			<div className="dashboard-top-layout">
				<div>

				</div>

				<div className="dashboard-top-button-layout">
					<Button icon={<FaPlus/>} label="Créer Groupe" onClick={() => setAddingGroup(true)}/>
				</div>
			</div>

			{groups.map(group => (
				<GroupProjectWidget key={group.id} group={group}/>
			))}
		</>
	)
}