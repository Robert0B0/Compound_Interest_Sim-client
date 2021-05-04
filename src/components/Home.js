import React, { useState, useEffect } from "react";
import { FETCH_PLANS } from "../util/graphql";
import { useQuery } from "@apollo/react-hooks";
import { Segment, Grid, Divider } from "semantic-ui-react";
import Plans from "../components/Plans";
import Simulation from "../components/Simulation";

export default function Home() {
	const { loading, data: { getPlans: plans } = {} } = useQuery(FETCH_PLANS);
	const [simPlan, setSimPlan] = useState({
		init_amount: 0,
		rate: 0,
		years: 0,
		cash_rate: 0,
		contribution: 0,
	});

	useEffect(() => {
		const plan = localStorage.getItem("plan");
		if (plan) {
			setSimPlan(plan);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("plan", simPlan);
	}, [simPlan]);

	return (
		<div>
			<Grid columns={2}>
				<Grid.Column width={3} className="plans_container">
					<h3>Saved plans:</h3>
					<Plans loading={loading} plans={plans} setSimPlan={setSimPlan} />
				</Grid.Column>
				<Grid.Column width={12} simPlan={simPlan}>
					<Simulation setSimPlan={setSimPlan} simPlan={simPlan} />
				</Grid.Column>
			</Grid>
		</div>
	);
}
