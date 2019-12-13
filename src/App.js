import React, { useContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
	sidebarOpen: false,
	sidebarPanelId: null
};

const StoreContext = React.createContext(INITIAL_STATE);

const DEFAULT_CONFIG = {
	sidebarPanels: [
		[
			{
				sidebarPanelId: "one"
			},
			{
				sidebarPanelId: "two"
			}
		],
		[
			{
				sidebarPanelId: "three"
			},
			{
				sidebarPanelId: "four"
			}
		]
	]
};

const ConfigContext = React.createContext(DEFAULT_CONFIG);

const DispatchContext = React.createContext(() => {});

function reducer(state, action) {
	let nextState;

	switch (action.type) {
		case "TOGGLE":
			nextState = { ...state };

			if (state.sidebarPanelId !== action.sidebarPanelId)
				nextState.sidebarPanelId = action.sidebarPanelId;

			if (state.sidebarOpen !== action.sidebarOpen)
				nextState.sidebarOpen = action.sidebarOpen;
			break;

		default:
			break;
	}

	return nextState;
}

function App() {
	const config = useContext(DEFAULT_CONFIG);
	const [store, dispatch] = useReducer(reducer, INITIAL_STATE);
	const { sidebarPanels } = useContext(ConfigContext);
	const buttons = sidebarPanels.reduce((acc, val) => acc.concat(val, []));

	useEffect(() => {
		const panel = sidebarPanels[0] && sidebarPanels[0][0];

		if (panel) {
			dispatch({
				type: "TOGGLE",
				sidebarPanelId: panel.sidebarPanelId,
				sidebarOpen: true
			});
		} else {
		}
	}, []);

	return (
		<ConfigContext.Provider value={config}>
			<StoreContext.Provider value={store}>
				<DispatchContext.Provider value={dispatch}>
					<div>
						<ul>
							{buttons.map((element, index) => (
								<li
									onClick={() => {
										let sidebarOpen = store.sidebarOpen;
										if (element.sidebarPanelId === store.sidebarPanelId) {
											sidebarOpen = !store.sidebarOpen;
										}

										dispatch({
											type: "TOGGLE",
											sidebarOpen,
											sidebarPanelId: element.sidebarPanelId
										});
									}}
									key={`element-${index}`}
								>
									{element.sidebarPanelId}
								</li>
							))}
						</ul>
						<DummyButton />
						<pre>{JSON.stringify(store, null, 0)}</pre>
					</div>
				</DispatchContext.Provider>
			</StoreContext.Provider>
		</ConfigContext.Provider>
	);
}

function DummyButton() {
	const dispatch = useContext(DispatchContext);

	return (
		<button
			onClick={() => {
				dispatch({
					type: "TOGGLE",
					sidebarOpen: true,
					sidebarPanelId: "two"
				});
			}}
		>
			Dispatch an action from me
		</button>
	);
}

export default App;
