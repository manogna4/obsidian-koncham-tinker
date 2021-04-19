import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView, Workspace} from 'obsidian';
import { WorkspaceSplit, WorkspaceLeaf, WorkspaceItem } from 'obsidian';
import { ItemView, Menu } from 'obsidian';

const plugin_name = 'koncham-tinker'

const view_type = 'root-leaves-list'

export default class MyPlugin extends Plugin {
	public view: RootLeavesListView;

	async onload() {
		console.log('loading plugin: ' + plugin_name);

		this.registerView(
			view_type,
			(leaf) => (this.view = new RootLeavesListView(leaf, this))
		);

		if (this.app.workspace.layoutReady) {
			this.initView();
		} else {
			this.registerEvent(this.app.workspace.on('layout-ready', this.initView));
		}

		this.registerEvent(this.app.workspace.on('active-leaf-change', this.handleFocusChange));

		this.addCommand({
			id: 'leaves-iterate',
			name: 'leaves-iterate',
			hotkeys: [{"modifiers": ["Alt"],"key": "y"}],
			callback: () => this.leavesIterate(),
		});

		this.addCommand({
			id: 'placeholder',
			name: 'placeholder',
			hotkeys: [{ "modifiers": ["Alt"], "key": "k" }],
			callback: () => this.placeholder(),
		});

	}

	private readonly initView = (): void => {
		if (this.app.workspace.getLeavesOfType(view_type).length) {
			return;
		}
		this.app.workspace.getLeftLeaf(false).setViewState({
			type: view_type,
			active: true,
		});
	};

	leavesIterate() {
		this.app.workspace.iterateAllLeaves((leaf: any) => {
			console.log(leaf.getDisplayText());
			console.log(leaf.getViewState());
		});
	}

	placeholder() {
		let leaf_curr = this.app.workspace.activeLeaf;
		let varm = this.app.workspace.createLeafBySplit(leaf_curr, 'horizontal', true);
		console.log(varm);
	}

	private readonly handleFocusChange = async() => {
		this.view.initialize();
	}

	onunload() {
		console.log('unloading plugin: ' + plugin_name);
	}

}


class RootLeavesListView extends ItemView{
	private readonly plugin: MyPlugin
	
	constructor(
		leaf: WorkspaceLeaf,
		plugin: MyPlugin,
	) {
		super(leaf);

		this.plugin = plugin;
		this.initialize();
	}

	public readonly initialize = (): void => {
		let leaf_active = this.app.workspace.activeLeaf;
		const rootEl = createDiv({ cls: 'nav-folder mod-root' });
		const childrenEl = rootEl.createDiv({ cls: 'nav-folder-children' });
		this.app.workspace.iterateRootLeaves((leaf: any) => {
			const navFile = childrenEl.createDiv({ cls: 'nav-file' });
			const navFileTitle = navFile.createDiv({ cls: 'nav-file-title' });

			if (leaf === leaf_active) {
				navFileTitle.addClass('is-active');
			}

			navFileTitle.createDiv({
				cls: 'nav-file-title-content',
				text: leaf.getDisplayText(),
			});
			const contentEl = this.containerEl.children[1];
			contentEl.empty();
			contentEl.appendChild(rootEl);
		});
	}

	public getViewType(): string {
		return view_type;
	}

	public getDisplayText(): string {
		return 'Root Leaves';
	}

	public getIcon(): string {
		return 'double-down-arrow-glyph';
	}

	// mch_todo change icons
	public onHeaderMenu(menu: Menu): void {
		menu
			.addItem((item) => {
				item
					.setTitle('action1')
					.setIcon('sweep')
					.onClick(async () => {
						new Notice('action1');
					});
			})
			.addItem((item) => {
				item
					.setTitle('close')
					.setIcon('cross')
					.onClick(() => {
						this.app.workspace.detachLeavesOfType(view_type);
					});
			});
	}
}


