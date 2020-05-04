import KineticScrollingPluginObjectCallback from './KineticScrollingPluginObjectCallback'

interface KineticScrollingPluginEvents {
    up: KineticScrollingPluginObjectCallback,
    down: KineticScrollingPluginObjectCallback,
    click: KineticScrollingPluginObjectCallback,
    inputIsDown: boolean,
    downTimer: number,
}

export default KineticScrollingPluginEvents;
