import React, {useState, useEffect } from "react";
import StageService, { StageOffer } from "../../../services/StageService";
import EmptyWidget from "../../../components/ui/EmptyWidget";
import DashboardPage from "../DashboardPage";
import { MdWorkOutline } from "react-icons/md";
import StageOfferWidget from "../../../components/objects/StageOfferWidget";

import "./StageOfferListPage.css"

export default function StageOfferListPage(){
	const [offres, setOffres] = useState<StageOffer[]>([]);

	useEffect(() => {
		const getOffers = async () => {
			try {
				const res = await StageService.getStageOfferList();
				setOffres(res);
			} catch (err) {
				
			}
		}

		getOffers();
	}, []);
	return (
		<DashboardPage>
			<div className="dashboard-top-layout">
				<div className="dashboard-top-title-layout">
					<span style={{fontWeight: "var(--big-bold)", fontSize: "25px"}}>Stages</span>
				</div>
			</div>

			<span style={{color: "var(--gray1-col)"}}>Détails et informations sur les offres de stages.</span>

			{offres.length > 0 ? (
				<div className="stage-offre-list-layout">
					{offres.map(offer => (
						<StageOfferWidget offer={offer}/>
					))}
				</div>
			) : (
				<EmptyWidget icon={<MdWorkOutline size={30}/>} text="Aucune offre de stage pour le moment."/>
			)}

		</DashboardPage>
	)
}