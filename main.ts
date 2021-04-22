import { Editor, MarkdownView, Plugin} from 'obsidian';
const plugin_name = 'koncham-tinker'

export default class MyPlugin extends Plugin {

	onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		this.addCommand({
			id: 'placeholder1',
			name: 'placeholder1',
			hotkeys: [{ "modifiers": [], "key": "F16" }],
			callback: () => this.placeholder1(),
		});

		this.addCommand({
			id: 'placeholder2',
			name: 'placeholder2',
			hotkeys: [{ "modifiers": [], "key": "F15" }],
			callback: () => this.placeholder2(),
		});

		this.addCommand({
			id: 'placeholder3',
			name: 'placeholder3',
			hotkeys: [{ "modifiers": [], "key": "F14" }],
			callback: () => this.placeholder3(),
		});
	
	}

	placeholder1() {
		this.app.workspace.iterateRootLeaves((leaf: any) => {
			console.log(leaf.getDisplayText(), leaf.getViewState());
		});
	}

	placeholder2() {
		let var1 = this.app.workspace.activeLeaf.view.containerEl;
		console.log(var1);
	}

	placeholder3() {
		console.log(plugin_name + ': placeholder3')
		
	}
}
	





