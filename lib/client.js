window.__ModuleLoader__.load({id:"@dev-platform/runlark-theme",factory(require){const exports = {}; const module = { exports };
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
// \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
let react = require("react");
react = __toESM(react, 1);
// src/client/AppearanceThemeRow.tsx
/**
* Строка «Тема» в «Настройки → Общие → Внешний вид».
*
* Показывает подтверждённое Host-значение и пишет выбор только через
* `ConfigForm.set('selection', …)`. Локальная тема применяется после
* принятия записи: пока Host не подтвердил значение, слой не меняется.
*
* @module @dev-platform/runlark-theme/src/client/AppearanceThemeRow
*/
const { useCallback, useState, useSyncExternalStore } = react;
const ROW = {
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "12px 20px",
	width: "100%",
	padding: "14px 0"
};
const TEXT = {
	display: "flex",
	flexDirection: "column",
	gap: "2px",
	minWidth: "220px",
	flex: "1 1 260px"
};
const TITLE = {
	color: "var(--dsw-alias-label-primary)",
	fontSize: "13px",
	fontWeight: 500,
	lineHeight: "20px"
};
const DESCRIPTION = {
	color: "var(--dsw-alias-label-secondary)",
	fontSize: "12px",
	lineHeight: "18px"
};
const CONTROLS = {
	display: "flex",
	alignItems: "center",
	gap: "8px"
};
const SWATCH = {
	display: "inline-flex",
	alignItems: "center",
	gap: "2px",
	width: "30px",
	height: "20px",
	overflow: "hidden",
	border: "0.5px solid var(--dsw-alias-border-l2)",
	borderRadius: "5px",
	background: "var(--dsw-alias-bg-layer-1)"
};
const GROUP = {
	display: "inline-flex",
	padding: "2px",
	gap: "2px",
	borderRadius: "7px",
	background: "var(--dsw-alias-interactive-bg-hover)"
};
const OPTION = {
	appearance: "none",
	border: "0.5px solid transparent",
	borderRadius: "5px",
	padding: "4px 10px",
	font: "inherit",
	fontSize: "12px",
	lineHeight: "18px",
	cursor: "pointer",
	color: "var(--dsw-alias-label-secondary)",
	background: "transparent"
};
const OPTION_SELECTED = {
	...OPTION,
	color: "var(--dsw-alias-label-primary-foreground)",
	background: "var(--dsw-alias-button-primary-fill)",
	borderColor: "var(--dsw-alias-button-primary-fill)"
};
const OPTION_DISABLED = {
	cursor: "default",
	opacity: .55
};
const ERROR = {
	...DESCRIPTION,
	color: "var(--dsw-alias-state-error-primary)"
};
/**
* Отрисовать выбор темы.
*
* @param props - слот-пропсы, словарь и внедрённая форма.
* @returns строка настроек.
*/
function AppearanceThemeRow({ form, t }) {
	const subscribe = useCallback((onChange) => form.subscribe(onChange), [form]);
	const getSnapshot = useCallback(() => form.getSnapshot(), [form]);
	const snapshot = useSyncExternalStore(subscribe, getSnapshot);
	const [pending, setPending] = useState(null);
	const [error, setError] = useState(null);
	const accepted = snapshot.value?.selection ?? "default";
	const busy = pending !== null;
	const disabled = !(snapshot.writable && snapshot.status !== "unavailable") || busy;
	const choose = (next) => {
		if (disabled || next === accepted) return;
		setPending(next);
		setError(null);
		form.set("selection", next).then((ok) => {
			if (!ok) setError(t("row.error"));
		}).catch(() => {
			setError(t("row.error"));
		}).finally(() => {
			setPending(null);
		});
	};
	const status = error ?? (snapshot.status === "loading" ? t("row.loading") : snapshot.status === "unavailable" ? t("row.unavailable") : busy ? t("row.saving") : null);
	const options = [{
		value: "default",
		label: t("row.standard")
	}, {
		value: "runlark",
		label: t("row.runlark")
	}];
	return /* @__PURE__ */ react.createElement("div", {
		"data-runlark-theme-row": "",
		style: ROW
	}, /* @__PURE__ */ react.createElement("div", { style: TEXT }, /* @__PURE__ */ react.createElement("span", { style: TITLE }, t("row.title")), /* @__PURE__ */ react.createElement("span", {
		style: error === null ? DESCRIPTION : ERROR,
		role: error === null ? void 0 : "alert",
		"aria-live": error === null ? "polite" : void 0
	}, status ?? t("row.description"))), /* @__PURE__ */ react.createElement("div", { style: CONTROLS }, /* @__PURE__ */ react.createElement("span", {
		style: SWATCH,
		role: "img",
		"aria-label": t("row.palette")
	}, /* @__PURE__ */ react.createElement("span", { style: {
		flex: 1,
		alignSelf: "stretch",
		background: "#20232B"
	} }), /* @__PURE__ */ react.createElement("span", { style: {
		flex: 1,
		alignSelf: "stretch",
		background: "#EDB830"
	} }), /* @__PURE__ */ react.createElement("span", { style: {
		flex: 1,
		alignSelf: "stretch",
		background: "#F3F4F6"
	} })), /* @__PURE__ */ react.createElement("div", {
		style: GROUP,
		role: "radiogroup",
		"aria-label": t("row.title")
	}, options.map((option) => {
		const selected = option.value === accepted;
		return /* @__PURE__ */ react.createElement("button", {
			key: option.value,
			type: "button",
			role: "radio",
			"aria-checked": selected,
			disabled,
			style: {
				...selected ? OPTION_SELECTED : OPTION,
				...disabled ? OPTION_DISABLED : {}
			},
			onClick: () => {
				choose(option.value);
			}
		}, option.label);
	}))));
}
// src/client/locales.ts
/** Namespace строки в клиентском locale-реестре. */
const NS = "runlark-theme";
/** Английский словарь. */
const en = {
	"row.title": "Theme",
	"row.description": "Runlark colors on top of the light or dark scheme. Light, dark and system stay in Appearance.",
	"row.standard": "Standard",
	"row.runlark": "Runlark",
	"row.loading": "Loading the saved theme…",
	"row.saving": "Saving the theme…",
	"row.error": "Could not save the theme selection. Check the Host settings and try again.",
	"row.unavailable": "Theme settings are unavailable on this Host.",
	"row.palette": "Runlark ink and gold palette"
};
/** Русский словарь. */
const ru = {
	"row.title": "Тема",
	"row.description": "Оформление Runlark поверх светлой или тёмной схемы. Светлая, тёмная и системная остаются в «Внешнем виде».",
	"row.standard": "Стандартная",
	"row.runlark": "Runlark",
	"row.loading": "Загружаем сохранённую тему…",
	"row.saving": "Сохраняем тему…",
	"row.error": "Не удалось сохранить выбор темы. Проверьте настройки Host и повторите.",
	"row.unavailable": "Настройки темы недоступны на этом Host.",
	"row.palette": "Палитра Runlark: чернила и золото"
};
// node_modules/.pnpm/xstate@5.33.4/node_modules/xstate/dist/xstate-dev.esm.js
function getGlobal() {
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof self !== "undefined") return self;
	if (typeof window !== "undefined") return window;
	if (typeof global !== "undefined") return global;
}
function getDevTools() {
	const w = getGlobal();
	if (w.__xstate__) return w.__xstate__;
}
const devToolsAdapter = (service) => {
	if (typeof window === "undefined") return;
	const devTools = getDevTools();
	if (devTools) devTools.register(service);
};
// node_modules/.pnpm/xstate@5.33.4/node_modules/xstate/dist/raise-effbee0c.esm.js
var Mailbox = class {
	constructor(_process) {
		this._process = _process;
		this._active = false;
		this._current = null;
		this._last = null;
	}
	start() {
		this._active = true;
		this.flush();
	}
	clear() {
		if (this._current) {
			this._current.next = null;
			this._last = this._current;
		}
	}
	enqueue(event) {
		const enqueued = {
			value: event,
			next: null
		};
		if (this._current) {
			this._last.next = enqueued;
			this._last = enqueued;
			return;
		}
		this._current = enqueued;
		this._last = enqueued;
		if (this._active) this.flush();
	}
	flush() {
		while (this._current) {
			const consumed = this._current;
			this._process(consumed.value);
			this._current = consumed.next;
		}
		this._last = null;
	}
};
const TARGETLESS_KEY = "";
const STATE_IDENTIFIER = "#";
const WILDCARD = "*";
const XSTATE_INIT = "xstate.init";
const XSTATE_STOP = "xstate.stop";
/**
* Returns an event that represents an implicit event that is sent after the
* specified `delay`.
*
* @param delayRef The delay in milliseconds
* @param id The state node ID where this event is handled
*/
function createAfterEvent(delayRef, id) {
	return { type: `xstate.after.${delayRef}.${id}` };
}
/**
* Returns an event that represents that a final state node has been reached in
* the parent state node.
*
* @param id The final state node's parent state node `id`
* @param output The data to pass into the event
*/
function createDoneStateEvent(id, output) {
	return {
		type: `xstate.done.state.${id}`,
		output
	};
}
/**
* Returns an event that represents that an invoked service has terminated.
*
* An invoked service is terminated when it has reached a top-level final state
* node, but not when it is canceled.
*
* @param invokeId The invoked service ID
* @param output The data to pass into the event
*/
function createDoneActorEvent(invokeId, output) {
	return {
		type: `xstate.done.actor.${invokeId}`,
		output,
		actorId: invokeId
	};
}
function createErrorActorEvent(id, error) {
	return {
		type: `xstate.error.actor.${id}`,
		error,
		actorId: id
	};
}
function createInitEvent(input) {
	return {
		type: XSTATE_INIT,
		input
	};
}
/**
* This function makes sure that unhandled errors are thrown in a separate
* macrotask. It allows those errors to be detected by global error handlers and
* reported to bug tracking services without interrupting our own stack of
* execution.
*
* @param err Error to be thrown
*/
function reportUnhandledError(err) {
	setTimeout(() => {
		throw err;
	});
}
const symbolObservable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
function matchesState(parentStateId, childStateId) {
	const parentStateValue = toStateValue(parentStateId);
	const childStateValue = toStateValue(childStateId);
	if (typeof childStateValue === "string") {
		if (typeof parentStateValue === "string") return childStateValue === parentStateValue;
		return false;
	}
	if (typeof parentStateValue === "string") return parentStateValue in childStateValue;
	return Object.keys(parentStateValue).every((key) => {
		if (!(key in childStateValue)) return false;
		return matchesState(parentStateValue[key], childStateValue[key]);
	});
}
function toStatePath(stateId) {
	if (isArray(stateId)) return stateId;
	const result = [];
	let segment = "";
	for (let i = 0; i < stateId.length; i++) {
		switch (stateId.charCodeAt(i)) {
			case 92:
				segment += stateId[i + 1];
				i++;
				continue;
			case 46:
				result.push(segment);
				segment = "";
				continue;
		}
		segment += stateId[i];
	}
	result.push(segment);
	return result;
}
function toStateValue(stateValue) {
	if (isMachineSnapshot(stateValue)) return stateValue.value;
	if (typeof stateValue !== "string") return stateValue;
	return pathToStateValue(toStatePath(stateValue));
}
function pathToStateValue(statePath) {
	if (statePath.length === 1) return statePath[0];
	const value = {};
	let marker = value;
	for (let i = 0; i < statePath.length - 1; i++) if (i === statePath.length - 2) marker[statePath[i]] = statePath[i + 1];
	else {
		const previous = marker;
		marker = {};
		previous[statePath[i]] = marker;
	}
	return value;
}
function mapValues(collection, iteratee) {
	const result = {};
	const collectionKeys = Object.keys(collection);
	for (let i = 0; i < collectionKeys.length; i++) {
		const key = collectionKeys[i];
		result[key] = iteratee(collection[key], key, collection, i);
	}
	return result;
}
function toArrayStrict(value) {
	if (isArray(value)) return value;
	return [value];
}
function toArray(value) {
	if (value === void 0) return [];
	return toArrayStrict(value);
}
function resolveOutput(mapper, context, event, self) {
	if (typeof mapper === "function") return mapper({
		context,
		event,
		self
	});
	return mapper;
}
function isArray(value) {
	return Array.isArray(value);
}
function isErrorActorEvent(event) {
	return event.type.startsWith("xstate.error.actor");
}
function toTransitionConfigArray(configLike) {
	return toArrayStrict(configLike).map((transitionLike) => {
		if (typeof transitionLike === "undefined" || typeof transitionLike === "string") return { target: transitionLike };
		return transitionLike;
	});
}
function normalizeTarget(target) {
	if (target === void 0 || target === TARGETLESS_KEY) return;
	return toArray(target);
}
function toObserver(nextHandler, errorHandler, completionHandler) {
	const isObserver = typeof nextHandler === "object";
	const self = isObserver ? nextHandler : void 0;
	return {
		next: (isObserver ? nextHandler.next : nextHandler)?.bind(self),
		error: (isObserver ? nextHandler.error : errorHandler)?.bind(self),
		complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self)
	};
}
function createInvokeId(stateNodeId, index) {
	return `${index}.${stateNodeId}`;
}
function resolveReferencedActor(machine, src) {
	const match = src.match(/^xstate\.invoke\.(\d+)\.(.*)/);
	if (!match) return machine.implementations.actors[src];
	const [, indexStr, nodeId] = match;
	const invokeConfig = machine.getStateNodeById(nodeId).config.invoke;
	return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
}
/**
* Checks if an event type matches an event descriptor, supporting wildcards.
* Event descriptors can be:
*
* - Exact matches: "event.type"
* - Wildcard: "*"
* - Partial matches: "event.*"
*
* @param eventType - The actual event type string
* @param descriptor - The event descriptor to match against
* @returns True if the event type matches the descriptor
*/
function matchesEventDescriptor(eventType, descriptor) {
	if (descriptor === eventType) return true;
	if (descriptor === WILDCARD) return true;
	if (!descriptor.endsWith(".*")) return false;
	const partialEventTokens = descriptor.split(".");
	const eventTokens = eventType.split(".");
	for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
		const partialEventToken = partialEventTokens[tokenIndex];
		const eventToken = eventTokens[tokenIndex];
		if (partialEventToken === "*") return tokenIndex === partialEventTokens.length - 1;
		if (partialEventToken !== eventToken) return false;
	}
	return true;
}
function createScheduledEventId(actorRef, id) {
	return `${actorRef.sessionId}.${id}`;
}
let idCounter = 0;
function createSystem(rootActor, options) {
	const children = /* @__PURE__ */ new Map();
	const keyedActors = /* @__PURE__ */ new Map();
	const reverseKeyedActors = /* @__PURE__ */ new WeakMap();
	const inspectionObservers = /* @__PURE__ */ new Set();
	const timerMap = {};
	const { clock, logger } = options;
	const scheduler = {
		schedule: (source, target, event, delay, id = Math.random().toString(36).slice(2)) => {
			const scheduledEvent = {
				source,
				target,
				event,
				delay,
				id,
				startedAt: Date.now()
			};
			const scheduledEventId = createScheduledEventId(source, id);
			system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
			const timeout = clock.setTimeout(() => {
				delete timerMap[scheduledEventId];
				delete system._snapshot._scheduledEvents[scheduledEventId];
				system._relay(source, target, event);
			}, delay);
			timerMap[scheduledEventId] = timeout;
		},
		cancel: (source, id) => {
			const scheduledEventId = createScheduledEventId(source, id);
			const timeout = timerMap[scheduledEventId];
			delete timerMap[scheduledEventId];
			delete system._snapshot._scheduledEvents[scheduledEventId];
			if (timeout !== void 0) clock.clearTimeout(timeout);
		},
		cancelAll: (actorRef) => {
			for (const scheduledEventId in system._snapshot._scheduledEvents) {
				const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
				if (scheduledEvent.source === actorRef) scheduler.cancel(actorRef, scheduledEvent.id);
			}
		}
	};
	const sendInspectionEvent = (event) => {
		if (!inspectionObservers.size) return;
		const resolvedInspectionEvent = {
			...event,
			rootId: rootActor.sessionId
		};
		inspectionObservers.forEach((observer) => observer.next?.(resolvedInspectionEvent));
	};
	const system = {
		_snapshot: { _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {} },
		_bookId: () => `x:${idCounter++}`,
		_register: (sessionId, actorRef) => {
			children.set(sessionId, actorRef);
			return sessionId;
		},
		_unregister: (actorRef) => {
			children.delete(actorRef.sessionId);
			const systemId = reverseKeyedActors.get(actorRef);
			if (systemId !== void 0) {
				keyedActors.delete(systemId);
				reverseKeyedActors.delete(actorRef);
			}
		},
		get: (systemId) => {
			return keyedActors.get(systemId);
		},
		getAll: () => {
			return Object.fromEntries(keyedActors.entries());
		},
		_set: (systemId, actorRef) => {
			const existing = keyedActors.get(systemId);
			if (existing && existing !== actorRef) throw new Error(`Actor with system ID '${systemId}' already exists.`);
			keyedActors.set(systemId, actorRef);
			reverseKeyedActors.set(actorRef, systemId);
		},
		inspect: (observerOrFn) => {
			const observer = toObserver(observerOrFn);
			inspectionObservers.add(observer);
			return { unsubscribe() {
				inspectionObservers.delete(observer);
			} };
		},
		_sendInspectionEvent: sendInspectionEvent,
		_relay: (source, target, event) => {
			system._sendInspectionEvent({
				type: "@xstate.event",
				sourceRef: source,
				actorRef: target,
				event
			});
			target._send(event);
		},
		scheduler,
		getSnapshot: () => {
			return { _scheduledEvents: { ...system._snapshot._scheduledEvents } };
		},
		start: () => {
			const scheduledEvents = system._snapshot._scheduledEvents;
			system._snapshot._scheduledEvents = {};
			for (const scheduledId in scheduledEvents) {
				const { source, target, event, delay, id } = scheduledEvents[scheduledId];
				scheduler.schedule(source, target, event, delay, id);
			}
		},
		_clock: clock,
		_logger: logger
	};
	return system;
}
let executingCustomAction = false;
let ProcessingStatus = /*#__PURE__*/ function(ProcessingStatus) {
	ProcessingStatus[ProcessingStatus["NotStarted"] = 0] = "NotStarted";
	ProcessingStatus[ProcessingStatus["Running"] = 1] = "Running";
	ProcessingStatus[ProcessingStatus["Stopped"] = 2] = "Stopped";
	return ProcessingStatus;
}({});
const defaultOptions = {
	clock: {
		setTimeout: (fn, ms) => {
			return setTimeout(fn, ms);
		},
		clearTimeout: (id) => {
			return clearTimeout(id);
		}
	},
	logger: console.log.bind(console),
	devTools: false
};
/**
* An Actor is a running process that can receive events, send events and change
* its behavior based on the events it receives, which can cause effects outside
* of the actor. When you run a state machine, it becomes an actor.
*/
var Actor = class {
	/**
	* Creates a new actor instance for the given logic with the provided options,
	* if any.
	*
	* @param logic The logic to create an actor from
	* @param options Actor options
	*/
	constructor(logic, options) {
		this.logic = logic;
		/** The current internal state of the actor. */
		this._snapshot = void 0;
		/**
		* The clock that is responsible for setting and clearing timeouts, such as
		* delayed events and transitions.
		*/
		this.clock = void 0;
		this.options = void 0;
		/** The unique identifier for this actor relative to its parent. */
		this.id = void 0;
		this.mailbox = new Mailbox(this._process.bind(this));
		this.observers = /* @__PURE__ */ new Set();
		this.eventListeners = /* @__PURE__ */ new Map();
		this.logger = void 0;
		/** @internal */
		this._processingStatus = ProcessingStatus.NotStarted;
		this._parent = void 0;
		/** @internal */
		this._syncSnapshot = void 0;
		this.ref = void 0;
		this._actorScope = void 0;
		this.systemId = void 0;
		/** The globally unique process ID for this invocation. */
		this.sessionId = void 0;
		/** The system to which this actor belongs. */
		this.system = void 0;
		this._doneEvent = void 0;
		this.src = void 0;
		this._deferred = [];
		const resolvedOptions = {
			...defaultOptions,
			...options
		};
		const { clock, logger, parent, syncSnapshot, id, systemId, inspect } = resolvedOptions;
		this.system = parent ? parent.system : createSystem(this, {
			clock,
			logger
		});
		if (inspect && !parent) this.system.inspect(toObserver(inspect));
		this.sessionId = this.system._bookId();
		this.id = id ?? this.sessionId;
		this.logger = options?.logger ?? this.system._logger;
		this.clock = options?.clock ?? this.system._clock;
		this._parent = parent;
		this._syncSnapshot = syncSnapshot;
		this.options = resolvedOptions;
		this.src = resolvedOptions.src ?? logic;
		this.ref = this;
		this._actorScope = {
			self: this,
			id: this.id,
			sessionId: this.sessionId,
			logger: this.logger,
			defer: (fn) => {
				this._deferred.push(fn);
			},
			system: this.system,
			stopChild: (child) => {
				if (child._parent !== this) throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
				child._stop();
			},
			emit: (emittedEvent) => {
				const listeners = this.eventListeners.get(emittedEvent.type);
				const wildcardListener = this.eventListeners.get("*");
				if (!listeners && !wildcardListener) return;
				const allListeners = [...listeners ? listeners.values() : [], ...wildcardListener ? wildcardListener.values() : []];
				for (const handler of allListeners) try {
					handler(emittedEvent);
				} catch (err) {
					reportUnhandledError(err);
				}
			},
			actionExecutor: (action) => {
				const exec = () => {
					this._actorScope.system._sendInspectionEvent({
						type: "@xstate.action",
						actorRef: this,
						action: {
							type: action.type,
							params: action.params
						}
					});
					if (!action.exec) return;
					const saveExecutingCustomAction = executingCustomAction;
					try {
						executingCustomAction = true;
						action.exec(action.info, action.params);
					} finally {
						executingCustomAction = saveExecutingCustomAction;
					}
				};
				if (this._processingStatus === ProcessingStatus.Running) exec();
				else this._deferred.push(exec);
			}
		};
		this.send = this.send.bind(this);
		this.system._sendInspectionEvent({
			type: "@xstate.actor",
			actorRef: this
		});
		if (systemId) {
			this.systemId = systemId;
			this.system._set(systemId, this);
		}
		this._initState(options?.snapshot ?? options?.state);
		if (systemId && this._snapshot.status !== "active") this.system._unregister(this);
	}
	_initState(persistedState) {
		try {
			this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
		} catch (err) {
			this._snapshot = {
				status: "error",
				output: void 0,
				error: err
			};
		}
	}
	update(snapshot, event) {
		this._snapshot = snapshot;
		let deferredFn;
		while (deferredFn = this._deferred.shift()) try {
			deferredFn();
		} catch (err) {
			this._deferred.length = 0;
			this._snapshot = {
				...snapshot,
				status: "error",
				error: err
			};
		}
		switch (this._snapshot.status) {
			case "active":
				for (const observer of this.observers) try {
					observer.next?.(snapshot);
				} catch (err) {
					reportUnhandledError(err);
				}
				break;
			case "done":
				for (const observer of this.observers) try {
					observer.next?.(snapshot);
				} catch (err) {
					reportUnhandledError(err);
				}
				this._stopProcedure();
				this._complete();
				this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
				if (this._parent) this.system._relay(this, this._parent, this._doneEvent);
				break;
			case "error": this._error(this._snapshot.error);
		}
		this.system._sendInspectionEvent({
			type: "@xstate.snapshot",
			actorRef: this,
			event,
			snapshot
		});
	}
	/**
	* Subscribe an observer to an actor’s snapshot values.
	*
	* @remarks
	* The observer will receive the actor’s snapshot value when it is emitted.
	* The observer can be:
	*
	* - A plain function that receives the latest snapshot, or
	* - An observer object whose `.next(snapshot)` method receives the latest
	*   snapshot
	*
	* @example
	*
	* ```ts
	* // Observer as a plain function
	* const subscription = actor.subscribe((snapshot) => {
	*   console.log(snapshot);
	* });
	* ```
	*
	* @example
	*
	* ```ts
	* // Observer as an object
	* const subscription = actor.subscribe({
	*   next(snapshot) {
	*     console.log(snapshot);
	*   },
	*   error(err) {
	*     // ...
	*   },
	*   complete() {
	*     // ...
	*   }
	* });
	* ```
	*
	* The return value of `actor.subscribe(observer)` is a subscription object
	* that has an `.unsubscribe()` method. You can call
	* `subscription.unsubscribe()` to unsubscribe the observer:
	*
	* @example
	*
	* ```ts
	* const subscription = actor.subscribe((snapshot) => {
	*   // ...
	* });
	*
	* // Unsubscribe the observer
	* subscription.unsubscribe();
	* ```
	*
	* When the actor is stopped, all of its observers will automatically be
	* unsubscribed.
	*
	* @param observer - Either a plain function that receives the latest
	*   snapshot, or an observer object whose `.next(snapshot)` method receives
	*   the latest snapshot
	*/
	subscribe(nextListenerOrObserver, errorListener, completeListener) {
		const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
		if (this._processingStatus !== ProcessingStatus.Stopped) this.observers.add(observer);
		else switch (this._snapshot.status) {
			case "done":
				try {
					observer.complete?.();
				} catch (err) {
					reportUnhandledError(err);
				}
				break;
			case "error": {
				const err = this._snapshot.error;
				if (!observer.error) reportUnhandledError(err);
				else try {
					observer.error(err);
				} catch (err) {
					reportUnhandledError(err);
				}
				break;
			}
		}
		return { unsubscribe: () => {
			this.observers.delete(observer);
		} };
	}
	on(type, handler) {
		let listeners = this.eventListeners.get(type);
		if (!listeners) {
			listeners = /* @__PURE__ */ new Set();
			this.eventListeners.set(type, listeners);
		}
		const wrappedHandler = handler.bind(void 0);
		listeners.add(wrappedHandler);
		return { unsubscribe: () => {
			listeners.delete(wrappedHandler);
		} };
	}
	select(selector, equalityFn = Object.is) {
		return {
			subscribe: (observerOrFn) => {
				const observer = toObserver(observerOrFn);
				let previousSelected = selector(this.getSnapshot());
				return this.subscribe((snapshot) => {
					const nextSelected = selector(snapshot);
					if (!equalityFn(previousSelected, nextSelected)) {
						previousSelected = nextSelected;
						observer.next?.(nextSelected);
					}
				});
			},
			get: () => selector(this.getSnapshot())
		};
	}
	/** Starts the Actor from the initial state */
	start() {
		if (this._processingStatus === ProcessingStatus.Running) return this;
		if (this._syncSnapshot) this.subscribe({
			next: (snapshot) => {
				if (snapshot.status === "active") this.system._relay(this, this._parent, {
					type: `xstate.snapshot.${this.id}`,
					snapshot
				});
			},
			error: () => {}
		});
		this.system._register(this.sessionId, this);
		if (this.systemId) this.system._set(this.systemId, this);
		this._processingStatus = ProcessingStatus.Running;
		const initEvent = createInitEvent(this.options.input);
		this.system._sendInspectionEvent({
			type: "@xstate.event",
			sourceRef: this._parent,
			actorRef: this,
			event: initEvent
		});
		switch (this._snapshot.status) {
			case "done":
				this.update(this._snapshot, initEvent);
				return this;
			case "error":
				this._error(this._snapshot.error);
				return this;
		}
		if (!this._parent) this.system.start();
		if (this.logic.start) try {
			this.logic.start(this._snapshot, this._actorScope);
		} catch (err) {
			this._snapshot = {
				...this._snapshot,
				status: "error",
				error: err
			};
			this._error(err);
			return this;
		}
		this.update(this._snapshot, initEvent);
		if (this.options.devTools) this.attachDevTools();
		this.mailbox.start();
		return this;
	}
	_process(event) {
		let nextState;
		let caughtError;
		try {
			nextState = this.logic.transition(this._snapshot, event, this._actorScope);
		} catch (err) {
			caughtError = { err };
		}
		if (caughtError) {
			const { err } = caughtError;
			this._snapshot = {
				...this._snapshot,
				status: "error",
				error: err
			};
			this._error(err);
			return;
		}
		this.update(nextState, event);
		if (event.type === "xstate.stop") {
			this._stopProcedure();
			this._complete();
		}
	}
	_stop() {
		if (this._processingStatus === ProcessingStatus.Stopped) return this;
		this.mailbox.clear();
		if (this._processingStatus === ProcessingStatus.NotStarted) {
			this._processingStatus = ProcessingStatus.Stopped;
			return this;
		}
		this.mailbox.enqueue({ type: XSTATE_STOP });
		return this;
	}
	/** Stops the Actor and unsubscribe all listeners. */
	stop() {
		if (this._parent) throw new Error("A non-root actor cannot be stopped directly.");
		return this._stop();
	}
	_complete() {
		for (const observer of this.observers) try {
			observer.complete?.();
		} catch (err) {
			reportUnhandledError(err);
		}
		this.observers.clear();
		this.eventListeners.clear();
	}
	_reportError(err) {
		if (!this.observers.size) {
			if (!this._parent) reportUnhandledError(err);
			this.eventListeners.clear();
			return;
		}
		let reportError = false;
		for (const observer of this.observers) {
			const errorListener = observer.error;
			reportError ||= !errorListener;
			try {
				errorListener?.(err);
			} catch (err2) {
				reportUnhandledError(err2);
			}
		}
		this.observers.clear();
		this.eventListeners.clear();
		if (reportError) reportUnhandledError(err);
	}
	_error(err) {
		this._stopProcedure();
		this._reportError(err);
		if (this._parent) this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
	}
	_stopProcedure() {
		if (this._processingStatus !== ProcessingStatus.Running) return this;
		this.system.scheduler.cancelAll(this);
		this.mailbox.clear();
		this.mailbox = new Mailbox(this._process.bind(this));
		this._processingStatus = ProcessingStatus.Stopped;
		this.system._unregister(this);
		return this;
	}
	/** @internal */
	_send(event) {
		if (this._processingStatus === ProcessingStatus.Stopped) return;
		this.mailbox.enqueue(event);
	}
	/**
	* Sends an event to the running Actor to trigger a transition.
	*
	* @param event The event to send
	*/
	send(event) {
		this.system._relay(void 0, this, event);
	}
	attachDevTools() {
		const { devTools } = this.options;
		if (devTools) (typeof devTools === "function" ? devTools : devToolsAdapter)(this);
	}
	toJSON() {
		return {
			xstate$$type: 1,
			id: this.id
		};
	}
	/**
	* Obtain the internal state of the actor, which can be persisted.
	*
	* @remarks
	* The internal state can be persisted from any actor, not only machines.
	*
	* Note that the persisted state is not the same as the snapshot from
	* {@link Actor.getSnapshot}. Persisted state represents the internal state of
	* the actor, while snapshots represent the actor's last emitted value.
	*
	* Can be restored with {@link ActorOptions.state}
	* @see https://stately.ai/docs/persistence
	*/
	getPersistedSnapshot(options) {
		return this.logic.getPersistedSnapshot(this._snapshot, options);
	}
	[symbolObservable]() {
		return this;
	}
	/**
	* Read an actor’s snapshot synchronously.
	*
	* @remarks
	* The snapshot represent an actor's last emitted value.
	*
	* When an actor receives an event, its internal state may change. An actor
	* may emit a snapshot when a state transition occurs.
	*
	* Note that some actors, such as callback actors generated with
	* `fromCallback`, will not emit snapshots.
	* @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
	* @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
	*/
	getSnapshot() {
		return this._snapshot;
	}
};
/**
* Creates a new actor instance for the given actor logic with the provided
* options, if any.
*
* @remarks
* When you create an actor from actor logic via `createActor(logic)`, you
* implicitly create an actor system where the created actor is the root actor.
* Any actors spawned from this root actor and its descendants are part of that
* actor system.
* @example
*
* ```ts
* import { createActor } from 'xstate';
* import { someActorLogic } from './someActorLogic.ts';
*
* // Creating the actor, which implicitly creates an actor system with itself as the root actor
* const actor = createActor(someActorLogic);
*
* actor.subscribe((snapshot) => {
*   console.log(snapshot);
* });
*
* // Actors must be started by calling `actor.start()`, which will also start the actor system.
* actor.start();
*
* // Actors can receive events
* actor.send({ type: 'someEvent' });
*
* // You can stop root actors by calling `actor.stop()`, which will also stop the actor system and all actors in that system.
* actor.stop();
* ```
*
* @param logic - The actor logic to create an actor from. For a state machine
*   actor logic creator, see {@link createMachine}. Other actor logic creators
*   include {@link fromCallback}, {@link fromEventObservable},
*   {@link fromObservable}, {@link fromPromise}, and {@link fromTransition}.
* @param options - Actor options
*/
function createActor(logic, ...[options]) {
	return new Actor(logic, options);
}
/**
* @deprecated Use `Actor` instead.
* @alias
*/
function resolveCancel(_, snapshot, actionArgs, actionParams, { sendId }) {
	return [
		snapshot,
		{ sendId: typeof sendId === "function" ? sendId(actionArgs, actionParams) : sendId },
		void 0
	];
}
function executeCancel(actorScope, params) {
	actorScope.defer(() => {
		actorScope.system.scheduler.cancel(actorScope.self, params.sendId);
	});
}
/**
* Cancels a delayed `sendTo(...)` action that is waiting to be executed. The
* canceled `sendTo(...)` action will not send its event or execute, unless the
* `delay` has already elapsed before `cancel(...)` is called.
*
* @example
*
* ```ts
* import { createMachine, sendTo, cancel } from 'xstate';
*
* const machine = createMachine({
*   // ...
*   on: {
*     sendEvent: {
*       actions: sendTo(
*         'some-actor',
*         { type: 'someEvent' },
*         {
*           id: 'some-id',
*           delay: 1000
*         }
*       )
*     },
*     cancelEvent: {
*       actions: cancel('some-id')
*     }
*   }
* });
* ```
*
* @param sendId The `id` of the `sendTo(...)` action to cancel.
*/
function cancel(sendId) {
	function cancel(_args, _params) {}
	cancel.type = "xstate.cancel";
	cancel.sendId = sendId;
	cancel.resolve = resolveCancel;
	cancel.execute = executeCancel;
	return cancel;
}
function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, { id, systemId, src, input, syncSnapshot }) {
	const logic = typeof src === "string" ? resolveReferencedActor(snapshot.machine, src) : src;
	const resolvedId = typeof id === "function" ? id(actionArgs) : id;
	let actorRef;
	let resolvedInput = void 0;
	if (logic) {
		resolvedInput = typeof input === "function" ? input({
			context: snapshot.context,
			event: actionArgs.event,
			self: actorScope.self
		}) : input;
		actorRef = createActor(logic, {
			id: resolvedId,
			src,
			parent: actorScope.self,
			syncSnapshot,
			systemId,
			input: resolvedInput
		});
	}
	return [
		cloneMachineSnapshot(snapshot, { children: {
			...snapshot.children,
			[resolvedId]: actorRef
		} }),
		{
			id,
			systemId,
			actorRef,
			src,
			input: resolvedInput
		},
		void 0
	];
}
function executeSpawn(actorScope, { actorRef }) {
	if (!actorRef) return;
	actorScope.defer(() => {
		if (actorRef._processingStatus === ProcessingStatus.Stopped) return;
		actorRef.start();
	});
}
function spawnChild(...[src, { id, systemId, input, syncSnapshot = false } = {}]) {
	function spawnChild(_args, _params) {}
	spawnChild.type = "xstate.spawnChild";
	spawnChild.id = id;
	spawnChild.systemId = systemId;
	spawnChild.src = src;
	spawnChild.input = input;
	spawnChild.syncSnapshot = syncSnapshot;
	spawnChild.resolve = resolveSpawn;
	spawnChild.execute = executeSpawn;
	return spawnChild;
}
function resolveStop(_, snapshot, args, actionParams, { actorRef }) {
	const actorRefOrString = typeof actorRef === "function" ? actorRef(args, actionParams) : actorRef;
	const resolvedActorRef = typeof actorRefOrString === "string" ? snapshot.children[actorRefOrString] : actorRefOrString;
	let children = snapshot.children;
	if (resolvedActorRef) {
		children = { ...children };
		delete children[resolvedActorRef.id];
	}
	return [
		cloneMachineSnapshot(snapshot, { children }),
		resolvedActorRef,
		void 0
	];
}
function unregisterRecursively(actorScope, actorRef) {
	const snapshot = actorRef.getSnapshot();
	if (snapshot && "children" in snapshot) for (const child of Object.values(snapshot.children)) unregisterRecursively(actorScope, child);
	actorScope.system._unregister(actorRef);
}
function executeStop(actorScope, actorRef) {
	if (!actorRef) return;
	unregisterRecursively(actorScope, actorRef);
	if (actorRef._processingStatus !== ProcessingStatus.Running) {
		actorScope.stopChild(actorRef);
		return;
	}
	actorScope.defer(() => {
		actorScope.stopChild(actorRef);
	});
}
/**
* Stops a child actor.
*
* @param actorRef The actor to stop.
*/
function stopChild(actorRef) {
	function stop(_args, _params) {}
	stop.type = "xstate.stopChild";
	stop.actorRef = actorRef;
	stop.resolve = resolveStop;
	stop.execute = executeStop;
	return stop;
}
function checkAnd(snapshot, { context, event }, { guards }) {
	return guards.every((guard) => evaluateGuard(guard, context, event, snapshot));
}
/**
* Higher-order guard that evaluates to `true` if all `guards` passed to it
* evaluate to `true`.
*
* @category Guards
* @example
*
* ```ts
* import { setup, and } from 'xstate';
*
* const machine = setup({
*   guards: {
*     someNamedGuard: () => true
*   }
* }).createMachine({
*   on: {
*     someEvent: {
*       guard: and([({ context }) => context.value > 0, 'someNamedGuard']),
*       actions: () => {
*         // will be executed if all guards in `and(...)`
*         // evaluate to true
*       }
*     }
*   }
* });
* ```
*
* @returns A guard action object
*/
function and(guards) {
	function and(_args, _params) {
		return false;
	}
	and.check = checkAnd;
	and.guards = guards;
	return and;
}
function evaluateGuard(guard, context, event, snapshot) {
	const { machine } = snapshot;
	const isInline = typeof guard === "function";
	const resolved = isInline ? guard : machine.implementations.guards[typeof guard === "string" ? guard : guard.type];
	if (!isInline && !resolved) throw new Error(`Guard '${typeof guard === "string" ? guard : guard.type}' is not implemented.'.`);
	if (typeof resolved !== "function") return evaluateGuard(resolved, context, event, snapshot);
	const guardArgs = {
		context,
		event
	};
	const guardParams = isInline || typeof guard === "string" ? void 0 : "params" in guard ? typeof guard.params === "function" ? guard.params({
		context,
		event
	}) : guard.params : void 0;
	if (!("check" in resolved)) return resolved(guardArgs, guardParams);
	return resolved.check(snapshot, guardArgs, resolved);
}
function isAtomicStateNode(stateNode) {
	return stateNode.type === "atomic" || stateNode.type === "final";
}
function getChildren(stateNode) {
	return Object.values(stateNode.states).filter((sn) => sn.type !== "history");
}
function getProperAncestors(stateNode, toStateNode) {
	const ancestors = [];
	if (toStateNode === stateNode) return ancestors;
	let m = stateNode.parent;
	while (m && m !== toStateNode) {
		ancestors.push(m);
		m = m.parent;
	}
	return ancestors;
}
function getAllStateNodes(stateNodes) {
	const nodeSet = new Set(stateNodes);
	const adjList = getAdjList(nodeSet);
	for (const s of nodeSet) if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) getInitialStateNodesWithTheirAncestors(s).forEach((sn) => nodeSet.add(sn));
	else if (s.type === "parallel") for (const child of getChildren(s)) {
		if (child.type === "history") continue;
		if (!nodeSet.has(child)) {
			const initialStates = getInitialStateNodesWithTheirAncestors(child);
			for (const initialStateNode of initialStates) nodeSet.add(initialStateNode);
		}
	}
	for (const s of nodeSet) {
		let m = s.parent;
		while (m) {
			nodeSet.add(m);
			m = m.parent;
		}
	}
	return nodeSet;
}
function getValueFromAdj(baseNode, adjList) {
	const childStateNodes = adjList.get(baseNode);
	if (!childStateNodes) return {};
	if (baseNode.type === "compound") {
		const childStateNode = childStateNodes[0];
		if (childStateNode) {
			if (isAtomicStateNode(childStateNode)) return childStateNode.key;
		} else return {};
	}
	const stateValue = {};
	for (const childStateNode of childStateNodes) stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
	return stateValue;
}
function getAdjList(stateNodes) {
	const adjList = /* @__PURE__ */ new Map();
	for (const s of stateNodes) {
		if (!adjList.has(s)) adjList.set(s, []);
		if (s.parent) {
			if (!adjList.has(s.parent)) adjList.set(s.parent, []);
			adjList.get(s.parent).push(s);
		}
	}
	return adjList;
}
function getStateValue(rootNode, stateNodes) {
	return getValueFromAdj(rootNode, getAdjList(getAllStateNodes(stateNodes)));
}
function isInFinalState(stateNodeSet, stateNode) {
	if (stateNode.type === "compound") return getChildren(stateNode).some((s) => s.type === "final" && stateNodeSet.has(s));
	if (stateNode.type === "parallel") return getChildren(stateNode).every((sn) => isInFinalState(stateNodeSet, sn));
	return stateNode.type === "final";
}
const isStateId = (str) => str[0] === STATE_IDENTIFIER;
function getCandidates(stateNode, receivedEventType) {
	const exactMatch = stateNode.transitions.get(receivedEventType);
	const wildcardCandidates = [...stateNode.transitions.keys()].filter((eventDescriptor) => eventDescriptor !== receivedEventType && matchesEventDescriptor(receivedEventType, eventDescriptor)).sort((a, b) => b.length - a.length).flatMap((key) => stateNode.transitions.get(key));
	return exactMatch ? [...exactMatch, ...wildcardCandidates] : wildcardCandidates;
}
/** All delayed transitions from the config. */
function getDelayedTransitions(stateNode) {
	const afterConfig = stateNode.config.after;
	if (!afterConfig) return [];
	const mutateEntryExit = (delay) => {
		const afterEvent = createAfterEvent(delay, stateNode.id);
		const eventType = afterEvent.type;
		stateNode.entry.push(raise(afterEvent, {
			id: eventType,
			delay
		}));
		stateNode.exit.push(cancel(eventType));
		return eventType;
	};
	return Object.keys(afterConfig).flatMap((delay) => {
		const configTransition = afterConfig[delay];
		const resolvedTransition = typeof configTransition === "string" ? { target: configTransition } : configTransition;
		const resolvedDelay = Number.isNaN(+delay) ? delay : +delay;
		const eventType = mutateEntryExit(resolvedDelay);
		return toArray(resolvedTransition).map((transition) => ({
			...transition,
			event: eventType,
			delay: resolvedDelay
		}));
	}).map((delayedTransition) => {
		const { delay } = delayedTransition;
		return {
			...formatTransition(stateNode, delayedTransition.event, delayedTransition),
			delay
		};
	});
}
function formatTransition(stateNode, descriptor, transitionConfig) {
	const normalizedTarget = normalizeTarget(transitionConfig.target);
	const reenter = transitionConfig.reenter ?? false;
	const target = resolveTarget(stateNode, normalizedTarget);
	const transition = {
		...transitionConfig,
		actions: toArray(transitionConfig.actions),
		guard: transitionConfig.guard,
		target,
		source: stateNode,
		reenter,
		eventType: descriptor,
		toJSON: () => ({
			...transition,
			source: `#${stateNode.id}`,
			target: target ? target.map((t) => `#${t.id}`) : void 0
		})
	};
	return transition;
}
function formatTransitions(stateNode) {
	const transitions = /* @__PURE__ */ new Map();
	if (stateNode.config.on) for (const descriptor of Object.keys(stateNode.config.on)) {
		if (descriptor === "") throw new Error("Null events (\"\") cannot be specified as a transition key. Use `always: { ... }` instead.");
		const transitionsConfig = stateNode.config.on[descriptor];
		transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map((t) => formatTransition(stateNode, descriptor, t)));
	}
	if (stateNode.config.onDone) {
		const descriptor = `xstate.done.state.${stateNode.id}`;
		transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
	}
	for (const invokeDef of stateNode.invoke) {
		if (invokeDef.onDone) {
			const descriptor = `xstate.done.actor.${invokeDef.id}`;
			transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
		}
		if (invokeDef.onError) {
			const descriptor = `xstate.error.actor.${invokeDef.id}`;
			transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map((t) => formatTransition(stateNode, descriptor, t)));
		}
		if (invokeDef.onSnapshot) {
			const descriptor = `xstate.snapshot.${invokeDef.id}`;
			transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map((t) => formatTransition(stateNode, descriptor, t)));
		}
	}
	for (const delayedTransition of stateNode.after) {
		let existing = transitions.get(delayedTransition.eventType);
		if (!existing) {
			existing = [];
			transitions.set(delayedTransition.eventType, existing);
		}
		existing.push(delayedTransition);
	}
	return transitions;
}
/**
* Collects route transitions from all descendants with explicit IDs. Called
* once on the root node to avoid O(N²) repeated traversals.
*/
function formatRouteTransitions(rootStateNode) {
	const routeTransitions = [];
	const collectRoutes = (states) => {
		Object.values(states).forEach((sn) => {
			if (sn.config.route && sn.config.id) {
				const routeId = sn.config.id;
				const userGuard = sn.config.route.guard;
				const routeMatches = ({ event }) => event.to === `#${routeId}`;
				const transition = {
					...sn.config.route,
					guard: userGuard ? and([routeMatches, userGuard]) : routeMatches,
					target: `#${routeId}`
				};
				routeTransitions.push(formatTransition(rootStateNode, "xstate.route", transition));
			}
			if (sn.states) collectRoutes(sn.states);
		});
	};
	collectRoutes(rootStateNode.states);
	if (routeTransitions.length > 0) rootStateNode.transitions.set("xstate.route", routeTransitions);
}
function formatInitialTransition(stateNode, _target) {
	const resolvedTarget = typeof _target === "string" ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : void 0;
	if (!resolvedTarget && _target) throw new Error(`Initial state node "${_target}" not found on parent state node #${stateNode.id}`);
	const transition = {
		source: stateNode,
		actions: !_target || typeof _target === "string" ? [] : toArray(_target.actions),
		eventType: null,
		reenter: false,
		target: resolvedTarget ? [resolvedTarget] : [],
		meta: typeof _target === "object" ? _target.meta : void 0,
		description: typeof _target === "object" ? _target.description : void 0,
		toJSON: () => ({
			...transition,
			source: `#${stateNode.id}`,
			target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
		})
	};
	return transition;
}
function resolveTarget(stateNode, targets) {
	if (targets === void 0) return;
	return targets.map((target) => {
		if (typeof target !== "string") return target;
		if (isStateId(target)) return stateNode.machine.getStateNodeById(target);
		const isInternalTarget = target[0] === ".";
		if (isInternalTarget && !stateNode.parent) return getStateNodeByPath(stateNode, target.slice(1));
		const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
		if (stateNode.parent) try {
			return getStateNodeByPath(stateNode.parent, resolvedTarget);
		} catch (err) {
			throw new Error(`Invalid transition definition for state node '${stateNode.id}':\n${err.message}`);
		}
		else throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
	});
}
function resolveHistoryDefaultTransition(stateNode) {
	const normalizedTarget = normalizeTarget(stateNode.config.target);
	if (!normalizedTarget) {
		if (stateNode.parent.type === "parallel") return { target: [stateNode.parent] };
		return stateNode.parent.initial;
	}
	return { target: normalizedTarget.map((t) => typeof t === "string" ? getStateNodeByPath(stateNode.parent, t) : t) };
}
function isHistoryNode(stateNode) {
	return stateNode.type === "history";
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
	const states = getInitialStateNodes(stateNode);
	for (const initialState of states) for (const ancestor of getProperAncestors(initialState, stateNode)) states.add(ancestor);
	return states;
}
function getInitialStateNodes(stateNode) {
	const set = /* @__PURE__ */ new Set();
	function iter(descStateNode) {
		if (set.has(descStateNode)) return;
		set.add(descStateNode);
		if (descStateNode.type === "compound") iter(descStateNode.initial.target[0]);
		else if (descStateNode.type === "parallel") for (const child of getChildren(descStateNode)) iter(child);
	}
	iter(stateNode);
	return set;
}
/** Returns the child state node from its relative `stateKey`, or throws. */
function getStateNode(stateNode, stateKey) {
	if (isStateId(stateKey)) return stateNode.machine.getStateNodeById(stateKey);
	if (!stateNode.states) throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
	const result = stateNode.states[stateKey];
	if (!result) throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
	return result;
}
/**
* Returns the relative state node from the given `statePath`, or throws.
*
* @param statePath The string or string array relative path to the state node.
*/
function getStateNodeByPath(stateNode, statePath) {
	if (typeof statePath === "string" && isStateId(statePath)) try {
		return stateNode.machine.getStateNodeById(statePath);
	} catch {}
	const arrayStatePath = toStatePath(statePath).slice();
	let currentStateNode = stateNode;
	while (arrayStatePath.length) {
		const key = arrayStatePath.shift();
		if (!key.length) break;
		currentStateNode = getStateNode(currentStateNode, key);
	}
	return currentStateNode;
}
/**
* Returns the state nodes represented by the current state value.
*
* @param stateValue The state value or State instance
*/
function getStateNodes(stateNode, stateValue) {
	if (typeof stateValue === "string") {
		const childStateNode = stateNode.states[stateValue];
		if (!childStateNode) throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
		return [stateNode, childStateNode];
	}
	const childStateKeys = Object.keys(stateValue);
	const childStateNodes = childStateKeys.map((subStateKey) => getStateNode(stateNode, subStateKey)).filter(Boolean);
	return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
		const subStateNode = getStateNode(stateNode, subStateKey);
		if (!subStateNode) return allSubStateNodes;
		const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
		return allSubStateNodes.concat(subStateNodes);
	}, []));
}
function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
	const next = getStateNode(stateNode, stateValue).next(snapshot, event);
	if (!next || !next.length) return stateNode.next(snapshot, event);
	return next;
}
function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
	const subStateKeys = Object.keys(stateValue);
	const next = transitionNode(getStateNode(stateNode, subStateKeys[0]), stateValue[subStateKeys[0]], snapshot, event);
	if (!next || !next.length) return stateNode.next(snapshot, event);
	return next;
}
function transitionParallelNode(stateNode, stateValue, snapshot, event) {
	const allInnerTransitions = [];
	for (const subStateKey of Object.keys(stateValue)) {
		const subStateValue = stateValue[subStateKey];
		if (!subStateValue) continue;
		const innerTransitions = transitionNode(getStateNode(stateNode, subStateKey), subStateValue, snapshot, event);
		if (innerTransitions) allInnerTransitions.push(...innerTransitions);
	}
	if (!allInnerTransitions.length) return stateNode.next(snapshot, event);
	return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, snapshot, event) {
	if (typeof stateValue === "string") return transitionAtomicNode(stateNode, stateValue, snapshot, event);
	if (Object.keys(stateValue).length === 1) return transitionCompoundNode(stateNode, stateValue, snapshot, event);
	return transitionParallelNode(stateNode, stateValue, snapshot, event);
}
function getHistoryNodes(stateNode) {
	return Object.keys(stateNode.states).map((key) => stateNode.states[key]).filter((sn) => sn.type === "history");
}
function isDescendant(childStateNode, parentStateNode) {
	let marker = childStateNode;
	while (marker.parent && marker.parent !== parentStateNode) marker = marker.parent;
	return marker.parent === parentStateNode;
}
function hasIntersection(s1, s2) {
	const set1 = new Set(s1);
	const set2 = new Set(s2);
	for (const item of set1) if (set2.has(item)) return true;
	for (const item of set2) if (set1.has(item)) return true;
	return false;
}
function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
	const filteredTransitions = /* @__PURE__ */ new Set();
	for (const t1 of enabledTransitions) {
		let t1Preempted = false;
		const transitionsToRemove = /* @__PURE__ */ new Set();
		for (const t2 of filteredTransitions) if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
			if (isDescendant(t1.source, t2.source)) transitionsToRemove.add(t2);
			else {
				t1Preempted = true;
				break;
			}
		}
		if (!t1Preempted) {
			for (const t3 of transitionsToRemove) filteredTransitions.delete(t3);
			filteredTransitions.add(t1);
		}
	}
	return Array.from(filteredTransitions);
}
function findLeastCommonAncestor(stateNodes) {
	const [head, ...tail] = stateNodes;
	for (const ancestor of getProperAncestors(head, void 0)) if (tail.every((sn) => isDescendant(sn, ancestor))) return ancestor;
}
function getEffectiveTargetStates(transition, historyValue) {
	if (!transition.target) return [];
	const targets = /* @__PURE__ */ new Set();
	for (const targetNode of transition.target) if (isHistoryNode(targetNode)) {
		if (historyValue[targetNode.id]) for (const node of historyValue[targetNode.id]) targets.add(node);
		else for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) targets.add(node);
	} else targets.add(targetNode);
	return [...targets];
}
function getTransitionDomain(transition, historyValue) {
	const targetStates = getEffectiveTargetStates(transition, historyValue);
	if (!targetStates) return;
	if (!transition.reenter && targetStates.every((target) => target === transition.source || isDescendant(target, transition.source))) return transition.source;
	const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
	if (lca) return lca;
	if (transition.reenter) return;
	return transition.source.machine.root;
}
function computeExitSet(transitions, stateNodeSet, historyValue) {
	const statesToExit = /* @__PURE__ */ new Set();
	for (const t of transitions) if (t.target?.length) {
		const domain = getTransitionDomain(t, historyValue);
		if (t.reenter && t.source === domain) statesToExit.add(domain);
		for (const stateNode of stateNodeSet) if (isDescendant(stateNode, domain)) statesToExit.add(stateNode);
	}
	return [...statesToExit];
}
function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
	if (prevStateNodes.length !== nextStateNodeSet.size) return false;
	for (const node of prevStateNodes) if (!nextStateNodeSet.has(node)) return false;
	return true;
}
function initialMicrostep(root, preInitialState, actorScope, initEvent, internalQueue) {
	return microstep([{
		target: [...getInitialStateNodes(root)],
		source: root,
		reenter: true,
		actions: [],
		eventType: null,
		toJSON: null
	}], preInitialState, actorScope, initEvent, true, internalQueue);
}
/** https://www.w3.org/TR/scxml/#microstepProcedure */
function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
	const actions = [];
	if (!transitions.length) return [currentSnapshot, actions];
	const originalExecutor = actorScope.actionExecutor;
	actorScope.actionExecutor = (action) => {
		actions.push(action);
		originalExecutor(action);
	};
	try {
		const mutStateNodeSet = new Set(currentSnapshot._nodes);
		let historyValue = currentSnapshot.historyValue;
		const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
		let nextState = currentSnapshot;
		if (!isInitial) [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue, actorScope.actionExecutor);
		nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap((t) => t.actions), internalQueue, void 0);
		nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
		const nextStateNodes = [...mutStateNodeSet];
		if (nextState.status === "done") nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap((state) => state.exit), internalQueue, void 0);
		try {
			if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) return [nextState, actions];
			return [cloneMachineSnapshot(nextState, {
				_nodes: nextStateNodes,
				historyValue
			}), actions];
		} catch (e) {
			throw e;
		}
	} finally {
		actorScope.actionExecutor = originalExecutor;
	}
}
function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
	if (rootNode.output === void 0) return;
	const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== void 0 && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : void 0);
	return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
}
function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
	let nextSnapshot = currentSnapshot;
	const statesToEnter = /* @__PURE__ */ new Set();
	const statesForDefaultEntry = /* @__PURE__ */ new Set();
	computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);
	if (isInitial) statesForDefaultEntry.add(currentSnapshot.machine.root);
	const completedNodes = /* @__PURE__ */ new Set();
	for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
		mutStateNodeSet.add(stateNodeToEnter);
		const actions = [];
		actions.push(...stateNodeToEnter.entry);
		for (const invokeDef of stateNodeToEnter.invoke) actions.push(spawnChild(invokeDef.src, {
			...invokeDef,
			syncSnapshot: !!invokeDef.onSnapshot
		}));
		if (statesForDefaultEntry.has(stateNodeToEnter)) {
			const initialActions = stateNodeToEnter.initial.actions;
			actions.push(...initialActions);
		}
		nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map((invokeDef) => invokeDef.id));
		if (stateNodeToEnter.type === "final") {
			const parent = stateNodeToEnter.parent;
			let ancestorMarker = parent?.type === "parallel" ? parent : parent?.parent;
			let rootCompletionNode = ancestorMarker || stateNodeToEnter;
			if (parent?.type === "compound") internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== void 0 ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : void 0));
			while (ancestorMarker?.type === "parallel" && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
				completedNodes.add(ancestorMarker);
				internalQueue.push(createDoneStateEvent(ancestorMarker.id));
				rootCompletionNode = ancestorMarker;
				ancestorMarker = ancestorMarker.parent;
			}
			if (ancestorMarker) continue;
			nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
				status: "done",
				output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
			});
		}
	}
	return nextSnapshot;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
	for (const t of transitions) {
		const domain = getTransitionDomain(t, historyValue);
		for (const s of t.target || []) {
			if (!isHistoryNode(s) && (t.source !== s || t.source !== domain || t.reenter)) {
				statesToEnter.add(s);
				statesForDefaultEntry.add(s);
			}
			addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
		}
		const targetStates = getEffectiveTargetStates(t, historyValue);
		for (const s of targetStates) {
			const ancestors = getProperAncestors(s, domain);
			if (domain?.type === "parallel") ancestors.push(domain);
			addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? void 0 : domain);
		}
	}
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
	if (isHistoryNode(stateNode)) {
		if (historyValue[stateNode.id]) {
			const historyStateNodes = historyValue[stateNode.id];
			for (const s of historyStateNodes) {
				statesToEnter.add(s);
				addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
			}
			for (const s of historyStateNodes) addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
		} else {
			const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
			for (const s of historyDefaultTransition.target) {
				statesToEnter.add(s);
				if (historyDefaultTransition === stateNode.parent?.initial) statesForDefaultEntry.add(stateNode.parent);
				addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
			}
			for (const s of historyDefaultTransition.target) addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
		}
	} else if (stateNode.type === "compound") {
		const [initialState] = stateNode.initial.target;
		if (!isHistoryNode(initialState)) {
			statesToEnter.add(initialState);
			statesForDefaultEntry.add(initialState);
		}
		addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
		addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
	} else if (stateNode.type === "parallel") {
		for (const child of getChildren(stateNode).filter((sn) => !isHistoryNode(sn))) if (![...statesToEnter].some((s) => isDescendant(s, child))) {
			if (!isHistoryNode(child)) {
				statesToEnter.add(child);
				statesForDefaultEntry.add(child);
			}
			addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
		}
	}
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
	for (const anc of ancestors) {
		if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) statesToEnter.add(anc);
		if (anc.type === "parallel") {
			for (const child of getChildren(anc).filter((sn) => !isHistoryNode(sn))) if (![...statesToEnter].some((s) => isDescendant(s, child))) {
				statesToEnter.add(child);
				addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
			}
		}
	}
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
	addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue, _actionExecutor) {
	let nextSnapshot = currentSnapshot;
	const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
	statesToExit.sort((a, b) => b.order - a.order);
	let changedHistory;
	for (const exitStateNode of statesToExit) for (const historyNode of getHistoryNodes(exitStateNode)) {
		let predicate;
		if (historyNode.history === "deep") predicate = (sn) => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
		else predicate = (sn) => {
			return sn.parent === exitStateNode;
		};
		changedHistory ??= { ...historyValue };
		changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
	}
	for (const s of statesToExit) {
		nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map((def) => stopChild(def.id))], internalQueue, void 0);
		mutStateNodeSet.delete(s);
	}
	return [nextSnapshot, changedHistory || historyValue];
}
function getAction(machine, actionType) {
	return machine.implementations.actions[actionType];
}
function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
	const { machine } = currentSnapshot;
	let intermediateSnapshot = currentSnapshot;
	for (const action of actions) {
		const isInline = typeof action === "function";
		const resolvedAction = isInline ? action : getAction(machine, typeof action === "string" ? action : action.type);
		const actionArgs = {
			context: intermediateSnapshot.context,
			event,
			self: actorScope.self,
			system: actorScope.system
		};
		const actionParams = isInline || typeof action === "string" ? void 0 : "params" in action ? typeof action.params === "function" ? action.params({
			context: intermediateSnapshot.context,
			event
		}) : action.params : void 0;
		if (!resolvedAction || !("resolve" in resolvedAction)) {
			actorScope.actionExecutor({
				type: typeof action === "string" ? action : typeof action === "object" ? action.type : action.name || "(anonymous)",
				info: actionArgs,
				params: actionParams,
				exec: resolvedAction
			});
			continue;
		}
		const builtinAction = resolvedAction;
		const [nextState, params, actions] = builtinAction.resolve(actorScope, intermediateSnapshot, actionArgs, actionParams, resolvedAction, extra);
		intermediateSnapshot = nextState;
		if ("retryResolve" in builtinAction) retries?.push([builtinAction, params]);
		if ("execute" in builtinAction) actorScope.actionExecutor({
			type: builtinAction.type,
			info: actionArgs,
			params,
			exec: builtinAction.execute.bind(null, actorScope, params)
		});
		if (actions) intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions, extra, retries);
	}
	return intermediateSnapshot;
}
function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
	const retries = deferredActorIds ? [] : void 0;
	const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
		internalQueue,
		deferredActorIds
	}, retries);
	retries?.forEach(([builtinAction, params]) => {
		builtinAction.retryResolve(actorScope, nextState, params);
	});
	return nextState;
}
function macrostep(snapshot, event, actorScope, internalQueue) {
	let nextSnapshot = snapshot;
	const microsteps = [];
	function addMicrostep(step, event, transitions) {
		actorScope.system._sendInspectionEvent({
			type: "@xstate.microstep",
			actorRef: actorScope.self,
			event,
			snapshot: step[0],
			_transitions: transitions
		});
		microsteps.push(step);
	}
	if (event.type === "xstate.stop") {
		nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), { status: "stopped" });
		addMicrostep([nextSnapshot, []], event, []);
		return {
			snapshot: nextSnapshot,
			microsteps
		};
	}
	let nextEvent = event;
	if (nextEvent.type !== XSTATE_INIT) {
		const currentEvent = nextEvent;
		const isErr = isErrorActorEvent(currentEvent);
		const transitions = selectTransitions(currentEvent, nextSnapshot);
		if (isErr && !transitions.length) {
			nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, currentEvent, actorScope), {
				status: "error",
				error: currentEvent.error
			});
			addMicrostep([nextSnapshot, []], currentEvent, []);
			return {
				snapshot: nextSnapshot,
				microsteps
			};
		}
		const step = microstep(transitions, snapshot, actorScope, nextEvent, false, internalQueue);
		nextSnapshot = step[0];
		addMicrostep(step, currentEvent, transitions);
	}
	let shouldSelectEventlessTransitions = true;
	const maxIterations = snapshot.machine.options?.maxIterations ?? 1e400;
	let iterationCount = 0;
	while (nextSnapshot.status === "active") {
		iterationCount++;
		if (iterationCount > maxIterations) throw new Error(`Infinite loop detected: the machine has processed more than ${maxIterations} microsteps without reaching a stable state. This usually happens when there's a cycle of transitions (e.g., eventless transitions or raised events causing state A -> B -> C -> A).`);
		let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];
		const previousState = enabledTransitions.length ? nextSnapshot : void 0;
		if (!enabledTransitions.length) {
			if (!internalQueue.length) break;
			nextEvent = internalQueue.shift();
			enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
		}
		const step = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
		nextSnapshot = step[0];
		shouldSelectEventlessTransitions = nextSnapshot !== previousState;
		addMicrostep(step, nextEvent, enabledTransitions);
	}
	if (nextSnapshot.status !== "active") stopChildren(nextSnapshot, nextEvent, actorScope);
	return {
		snapshot: nextSnapshot,
		microsteps
	};
}
function stopChildren(nextState, event, actorScope) {
	return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map((child) => stopChild(child)), [], void 0);
}
function selectTransitions(event, nextState) {
	return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
	const enabledTransitionSet = /* @__PURE__ */ new Set();
	const atomicStates = nextState._nodes.filter(isAtomicStateNode);
	for (const stateNode of atomicStates) loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, void 0))) {
		if (!s.always) continue;
		for (const transition of s.always) if (transition.guard === void 0 || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
			enabledTransitionSet.add(transition);
			break loop;
		}
	}
	return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
}
/**
* Resolves a partial state value with its full representation in the state
* node's machine.
*
* @param stateValue The partial state value to resolve.
*/
function resolveStateValue(rootNode, stateValue) {
	return getStateValue(rootNode, [...getAllStateNodes(getStateNodes(rootNode, stateValue))]);
}
function isMachineSnapshot(value) {
	return !!value && typeof value === "object" && "machine" in value && "value" in value;
}
const machineSnapshotMatches = function matches(testValue) {
	return matchesState(testValue, this.value);
};
const machineSnapshotHasTag = function hasTag(tag) {
	return this.tags.has(tag);
};
const machineSnapshotCan = function can(event) {
	const transitionData = this.machine.getTransitionData(this, event);
	return !!transitionData?.length && transitionData.some((t) => t.target !== void 0 || t.actions.length);
};
const machineSnapshotToJSON = function toJSON() {
	const { _nodes: nodes, tags, machine, getMeta, toJSON, can, hasTag, matches, ...jsonValues } = this;
	return {
		...jsonValues,
		tags: Array.from(tags)
	};
};
const machineSnapshotGetMeta = function getMeta() {
	return this._nodes.reduce((acc, stateNode) => {
		if (stateNode.meta !== void 0) acc[stateNode.id] = stateNode.meta;
		return acc;
	}, {});
};
function createMachineSnapshot(config, machine) {
	return {
		status: config.status,
		output: config.output,
		error: config.error,
		machine,
		context: config.context,
		_nodes: config._nodes,
		value: getStateValue(machine.root, config._nodes),
		tags: new Set(config._nodes.flatMap((sn) => sn.tags)),
		children: config.children,
		historyValue: config.historyValue || {},
		matches: machineSnapshotMatches,
		hasTag: machineSnapshotHasTag,
		can: machineSnapshotCan,
		getMeta: machineSnapshotGetMeta,
		toJSON: machineSnapshotToJSON
	};
}
function cloneMachineSnapshot(snapshot, config = {}) {
	return createMachineSnapshot({
		...snapshot,
		...config
	}, snapshot.machine);
}
function serializeHistoryValue(historyValue) {
	if (typeof historyValue !== "object" || historyValue === null) return {};
	const result = {};
	for (const key in historyValue) {
		const value = historyValue[key];
		if (Array.isArray(value)) result[key] = value.map((item) => ({ id: item.id }));
	}
	return result;
}
function getPersistedSnapshot(snapshot, options) {
	const { _nodes: nodes, tags, machine, children, context, can, hasTag, matches, getMeta, toJSON, ...jsonValues } = snapshot;
	const childrenJson = {};
	for (const id in children) {
		const child = children[id];
		childrenJson[id] = {
			snapshot: child.getPersistedSnapshot(options),
			src: child.src,
			systemId: child.systemId,
			syncSnapshot: child._syncSnapshot
		};
	}
	return {
		...jsonValues,
		context: persistContext(context),
		children: childrenJson,
		historyValue: serializeHistoryValue(jsonValues.historyValue)
	};
}
function persistContext(contextPart) {
	let copy;
	for (const key in contextPart) {
		const value = contextPart[key];
		if (value && typeof value === "object") {
			if ("sessionId" in value && "send" in value && "ref" in value) {
				copy ??= Array.isArray(contextPart) ? contextPart.slice() : { ...contextPart };
				copy[key] = {
					xstate$$type: 1,
					id: value.id
				};
			} else {
				const result = persistContext(value);
				if (result !== value) {
					copy ??= Array.isArray(contextPart) ? contextPart.slice() : { ...contextPart };
					copy[key] = result;
				}
			}
		}
	}
	return copy ?? contextPart;
}
function resolveRaise(_, snapshot, args, actionParams, { event: eventOrExpr, id, delay }, { internalQueue }) {
	const delaysMap = snapshot.machine.implementations.delays;
	if (typeof eventOrExpr === "string") throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
	const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
	let resolvedDelay;
	if (typeof delay === "string") {
		const configDelay = delaysMap && delaysMap[delay];
		resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
	} else resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
	if (typeof resolvedDelay !== "number") internalQueue.push(resolvedEvent);
	return [
		snapshot,
		{
			event: resolvedEvent,
			id,
			delay: resolvedDelay
		},
		void 0
	];
}
function executeRaise(actorScope, params) {
	const { event, delay, id } = params;
	if (typeof delay === "number") {
		actorScope.defer(() => {
			const self = actorScope.self;
			actorScope.system.scheduler.schedule(self, self, event, delay, id);
		});
		return;
	}
}
/**
* Raises an event. This places the event in the internal event queue, so that
* the event is immediately consumed by the machine in the current step.
*
* @param eventType The event to raise.
*/
function raise(eventOrExpr, options) {
	function raise(_args, _params) {}
	raise.type = "xstate.raise";
	raise.event = eventOrExpr;
	raise.id = options?.id;
	raise.delay = options?.delay;
	raise.resolve = resolveRaise;
	raise.execute = executeRaise;
	return raise;
}
// node_modules/.pnpm/xstate@5.33.4/node_modules/xstate/dist/assign-1f0d7720.esm.js
function createSpawner(actorScope, { machine, context }, event, spawnedChildren) {
	const spawn = (src, options) => {
		if (typeof src === "string") {
			const logic = resolveReferencedActor(machine, src);
			if (!logic) throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
			const actorRef = createActor(logic, {
				id: options?.id,
				parent: actorScope.self,
				syncSnapshot: options?.syncSnapshot,
				input: typeof options?.input === "function" ? options.input({
					context,
					event,
					self: actorScope.self
				}) : options?.input,
				src,
				systemId: options?.systemId
			});
			spawnedChildren[actorRef.id] = actorRef;
			return actorRef;
		} else return createActor(src, {
			id: options?.id,
			parent: actorScope.self,
			syncSnapshot: options?.syncSnapshot,
			input: options?.input,
			src,
			systemId: options?.systemId
		});
	};
	return (src, options) => {
		const actorRef = spawn(src, options);
		spawnedChildren[actorRef.id] = actorRef;
		actorScope.defer(() => {
			if (actorRef._processingStatus === ProcessingStatus.Stopped) return;
			actorRef.start();
		});
		return actorRef;
	};
}
function resolveAssign(actorScope, snapshot, actionArgs, actionParams, { assignment }) {
	if (!snapshot.context) throw new Error("Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.");
	const spawnedChildren = {};
	const assignArgs = {
		context: snapshot.context,
		event: actionArgs.event,
		spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
		self: actorScope.self,
		system: actorScope.system
	};
	let partialUpdate = {};
	if (typeof assignment === "function") partialUpdate = assignment(assignArgs, actionParams);
	else for (const key of Object.keys(assignment)) {
		const propAssignment = assignment[key];
		partialUpdate[key] = typeof propAssignment === "function" ? propAssignment(assignArgs, actionParams) : propAssignment;
	}
	return [
		cloneMachineSnapshot(snapshot, {
			context: Object.assign({}, snapshot.context, partialUpdate),
			children: Object.keys(spawnedChildren).length ? {
				...snapshot.children,
				...spawnedChildren
			} : snapshot.children
		}),
		void 0,
		void 0
	];
}
/**
* Updates the current context of the machine.
*
* @example
*
* ```ts
* import { createMachine, assign } from 'xstate';
*
* const countMachine = createMachine({
*   context: {
*     count: 0,
*     message: ''
*   },
*   on: {
*     inc: {
*       actions: assign({
*         count: ({ context }) => context.count + 1
*       })
*     },
*     updateMessage: {
*       actions: assign(({ context, event }) => {
*         return {
*           message: event.message.trim()
*         };
*       })
*     }
*   }
* });
* ```
*
* @param assignment An object that represents the partial context to update, or
*   a function that returns an object that represents the partial context to
*   update.
*/
function assign(assignment) {
	function assign(_args, _params) {}
	assign.type = "xstate.assign";
	assign.assignment = assignment;
	assign.resolve = resolveAssign;
	return assign;
}
// node_modules/.pnpm/xstate@5.33.4/node_modules/xstate/dist/StateMachine-ae06a22b.esm.js
const cache = /* @__PURE__ */ new WeakMap();
function memo(object, key, fn) {
	let memoizedData = cache.get(object);
	if (!memoizedData) {
		memoizedData = { [key]: fn() };
		cache.set(object, memoizedData);
	} else if (!(key in memoizedData)) memoizedData[key] = fn();
	return memoizedData[key];
}
const EMPTY_OBJECT = {};
const toSerializableAction = (action) => {
	if (typeof action === "string") return { type: action };
	if (typeof action === "function") {
		if ("resolve" in action) return { type: action.type };
		return { type: action.name };
	}
	return action;
};
var StateNode = class StateNode {
	constructor(config, options) {
		this.config = config;
		/**
		* The relative key of the state node, which represents its location in the
		* overall state value.
		*/
		this.key = void 0;
		/** The unique ID of the state node. */
		this.id = void 0;
		/**
		* The type of this state node:
		*
		* - `'atomic'` - no child state nodes
		* - `'compound'` - nested child state nodes (XOR)
		* - `'parallel'` - orthogonal nested child state nodes (AND)
		* - `'history'` - history state node
		* - `'final'` - final state node
		*/
		this.type = void 0;
		/** The string path from the root machine node to this node. */
		this.path = void 0;
		/** The child state nodes. */
		this.states = void 0;
		/**
		* The type of history on this state node. Can be:
		*
		* - `'shallow'` - recalls only top-level historical state value
		* - `'deep'` - recalls historical state value at all levels
		*/
		this.history = void 0;
		/** The action(s) to be executed upon entering the state node. */
		this.entry = void 0;
		/** The action(s) to be executed upon exiting the state node. */
		this.exit = void 0;
		/** The parent state node. */
		this.parent = void 0;
		/** The root machine node. */
		this.machine = void 0;
		/**
		* The meta data associated with this state node, which will be returned in
		* State instances.
		*/
		this.meta = void 0;
		/**
		* The output data sent with the "xstate.done.state._id_" event if this is a
		* final state node.
		*/
		this.output = void 0;
		/**
		* The order this state node appears. Corresponds to the implicit document
		* order.
		*/
		this.order = -1;
		this.description = void 0;
		this.tags = [];
		this.transitions = void 0;
		this.always = void 0;
		this.parent = options._parent;
		this.key = options._key;
		this.machine = options._machine;
		this.path = this.parent ? this.parent.path.concat(this.key) : [];
		this.id = this.config.id || [this.machine.id, ...this.path].join(".");
		this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
		this.description = this.config.description;
		this.order = this.machine.idMap.size;
		this.machine.idMap.set(this.id, this);
		this.states = this.config.states ? mapValues(this.config.states, (stateConfig, key) => {
			return new StateNode(stateConfig, {
				_parent: this,
				_key: key,
				_machine: this.machine
			});
		}) : EMPTY_OBJECT;
		if (this.type === "compound" && !this.config.initial) throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
		this.history = this.config.history === true ? "shallow" : this.config.history || false;
		this.entry = toArray(this.config.entry).slice();
		this.exit = toArray(this.config.exit).slice();
		this.meta = this.config.meta;
		this.output = this.type === "final" || !this.parent ? this.config.output : void 0;
		this.tags = toArray(config.tags).slice();
	}
	/** @internal */
	_initialize() {
		this.transitions = formatTransitions(this);
		if (this.config.always) this.always = toTransitionConfigArray(this.config.always).map((t) => formatTransition(this, "", t));
		Object.keys(this.states).forEach((key) => {
			this.states[key]._initialize();
		});
	}
	/** The well-structured state node definition. */
	get definition() {
		return {
			id: this.id,
			key: this.key,
			version: this.machine.version,
			type: this.type,
			initial: this.initial ? {
				target: this.initial.target,
				source: this,
				actions: this.initial.actions.map(toSerializableAction),
				eventType: null,
				reenter: false,
				meta: this.initial.meta,
				description: this.initial.description,
				toJSON: () => ({
					target: this.initial.target.map((t) => `#${t.id}`),
					source: `#${this.id}`,
					actions: this.initial.actions.map(toSerializableAction),
					eventType: null,
					meta: this.initial.meta,
					description: this.initial.description
				})
			} : void 0,
			history: this.history,
			states: mapValues(this.states, (state) => state.definition),
			on: this.on,
			transitions: [...this.transitions.values()].flat().map((t) => ({
				...t,
				actions: t.actions.map(toSerializableAction)
			})),
			entry: this.entry.map(toSerializableAction),
			exit: this.exit.map(toSerializableAction),
			meta: this.meta,
			order: this.order || -1,
			output: this.output,
			invoke: this.invoke,
			description: this.description,
			tags: this.tags
		};
	}
	/** @internal */
	toJSON() {
		return this.definition;
	}
	/** The logic invoked as actors by this state node. */
	get invoke() {
		return memo(this, "invoke", () => toArray(this.config.invoke).map((invokeConfig, i) => {
			const { src, systemId } = invokeConfig;
			const resolvedId = invokeConfig.id ?? createInvokeId(this.id, i);
			const sourceName = typeof src === "string" ? src : `xstate.invoke.${createInvokeId(this.id, i)}`;
			return {
				...invokeConfig,
				src: sourceName,
				id: resolvedId,
				systemId,
				toJSON() {
					const { onDone, onError, ...invokeDefValues } = invokeConfig;
					return {
						...invokeDefValues,
						type: "xstate.invoke",
						src: sourceName,
						id: resolvedId
					};
				}
			};
		}));
	}
	/** The mapping of events to transitions. */
	get on() {
		return memo(this, "on", () => {
			return [...this.transitions].flatMap(([descriptor, t]) => t.map((t) => [descriptor, t])).reduce((map, [descriptor, transition]) => {
				map[descriptor] = map[descriptor] || [];
				map[descriptor].push(transition);
				return map;
			}, {});
		});
	}
	get after() {
		return memo(this, "delayedTransitions", () => getDelayedTransitions(this));
	}
	get initial() {
		return memo(this, "initial", () => formatInitialTransition(this, this.config.initial));
	}
	/** @internal */
	next(snapshot, event) {
		const eventType = event.type;
		const actions = [];
		let selectedTransition;
		const candidates = memo(this, `candidates-${eventType}`, () => getCandidates(this, eventType));
		for (const candidate of candidates) {
			const { guard } = candidate;
			const resolvedContext = snapshot.context;
			let guardPassed = false;
			try {
				guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, snapshot);
			} catch (err) {
				const guardType = typeof guard === "string" ? guard : typeof guard === "object" ? guard.type : void 0;
				throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ""}in transition for event '${eventType}' in state node '${this.id}':\n${err.message}`);
			}
			if (guardPassed) {
				actions.push(...candidate.actions);
				selectedTransition = candidate;
				break;
			}
		}
		return selectedTransition ? [selectedTransition] : void 0;
	}
	/** All the event types accepted by this state node and its descendants. */
	get events() {
		return memo(this, "events", () => {
			const { states } = this;
			const events = new Set(this.ownEvents);
			if (states) for (const stateId of Object.keys(states)) {
				const state = states[stateId];
				if (state.states) for (const event of state.events) events.add(`${event}`);
			}
			return Array.from(events);
		});
	}
	/**
	* All the events that have transitions directly from this state node.
	*
	* Excludes any inert events.
	*/
	get ownEvents() {
		const keys = Object.keys(Object.fromEntries(this.transitions));
		const events = new Set(keys.filter((descriptor) => {
			return this.transitions.get(descriptor).some((transition) => !(!transition.target && !transition.actions.length && !transition.reenter));
		}));
		return Array.from(events);
	}
};
var StateMachine = class StateMachine {
	constructor(config, implementations) {
		this.config = config;
		/** The machine's own version. */
		this.version = void 0;
		this.schemas = void 0;
		this.implementations = void 0;
		/** Runtime options for machine execution. */
		this.options = void 0;
		/** @internal */
		this.__xstatenode = true;
		/** @internal */
		this.idMap = /* @__PURE__ */ new Map();
		this.root = void 0;
		this.id = void 0;
		this.states = void 0;
		this.events = void 0;
		this.id = config.id || "(machine)";
		this.implementations = {
			actors: implementations?.actors ?? {},
			actions: implementations?.actions ?? {},
			delays: implementations?.delays ?? {},
			guards: implementations?.guards ?? {}
		};
		this.version = this.config.version;
		this.schemas = this.config.schemas;
		this.options = {
			maxIterations: 1e400,
			...this.config.options
		};
		this.transition = this.transition.bind(this);
		this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
		this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
		this.restoreSnapshot = this.restoreSnapshot.bind(this);
		this.start = this.start.bind(this);
		this.root = new StateNode(config, {
			_key: this.id,
			_machine: this
		});
		this.root._initialize();
		formatRouteTransitions(this.root);
		this.states = this.root.states;
		this.events = this.root.events;
	}
	/**
	* Clones this state machine with the provided implementations.
	*
	* @param implementations Options (`actions`, `guards`, `actors`, `delays`) to
	*   recursively merge with the existing options.
	* @returns A new `StateMachine` instance with the provided implementations.
	*/
	provide(implementations) {
		const { actions, guards, actors, delays } = this.implementations;
		return new StateMachine(this.config, {
			actions: {
				...actions,
				...implementations.actions
			},
			guards: {
				...guards,
				...implementations.guards
			},
			actors: {
				...actors,
				...implementations.actors
			},
			delays: {
				...delays,
				...implementations.delays
			}
		});
	}
	resolveState(config) {
		const resolvedStateValue = resolveStateValue(this.root, config.value);
		const nodeSet = getAllStateNodes(getStateNodes(this.root, resolvedStateValue));
		return createMachineSnapshot({
			_nodes: [...nodeSet],
			context: config.context || {},
			children: {},
			status: isInFinalState(nodeSet, this.root) ? "done" : config.status || "active",
			output: config.output,
			error: config.error,
			historyValue: config.historyValue
		}, this);
	}
	/**
	* Determines the next snapshot given the current `snapshot` and received
	* `event`. Calculates a full macrostep from all microsteps.
	*
	* @param snapshot The current snapshot
	* @param event The received event
	*/
	transition(snapshot, event, actorScope) {
		return macrostep(snapshot, event, actorScope, []).snapshot;
	}
	/**
	* Determines the next state given the current `state` and `event`. Calculates
	* a microstep.
	*
	* @param state The current state
	* @param event The received event
	*/
	microstep(snapshot, event, actorScope) {
		return macrostep(snapshot, event, actorScope, []).microsteps.map(([s]) => s);
	}
	getTransitionData(snapshot, event) {
		return transitionNode(this.root, snapshot.value, snapshot, event) || [];
	}
	/**
	* The initial state _before_ evaluating any microsteps. This "pre-initial"
	* state is provided to initial actions executed in the initial state.
	*
	* @internal
	*/
	_getPreInitialState(actorScope, initEvent, internalQueue) {
		const { context } = this.config;
		const preInitial = createMachineSnapshot({
			context: typeof context !== "function" && context ? context : {},
			_nodes: [this.root],
			children: {},
			status: "active"
		}, this);
		if (typeof context === "function") {
			const assignment = ({ spawn, event, self }) => context({
				spawn,
				input: event.input,
				self
			});
			return resolveActionsAndContext(preInitial, initEvent, actorScope, [assign(assignment)], internalQueue, void 0);
		}
		return preInitial;
	}
	/**
	* Returns the initial `State` instance, with reference to `self` as an
	* `ActorRef`.
	*/
	getInitialSnapshot(actorScope, input) {
		const initEvent = createInitEvent(input);
		const internalQueue = [];
		let snapshot = createMachineSnapshot({
			context: typeof this.config.context !== "function" && this.config.context ? this.config.context : {},
			_nodes: [this.root],
			children: {},
			status: "active"
		}, this);
		try {
			snapshot = this._getPreInitialState(actorScope, initEvent, internalQueue);
			const [nextState] = initialMicrostep(this.root, snapshot, actorScope, initEvent, internalQueue);
			const { snapshot: macroState } = macrostep(nextState, initEvent, actorScope, internalQueue);
			return macroState;
		} catch (error) {
			return cloneMachineSnapshot(snapshot, {
				status: "error",
				error
			});
		}
	}
	start(snapshot) {
		Object.values(snapshot.children).forEach((child) => {
			if (child.getSnapshot().status === "active") child.start();
		});
	}
	getStateNodeById(stateId) {
		const fullPath = toStatePath(stateId);
		const relativePath = fullPath.slice(1);
		const resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(1) : fullPath[0];
		const stateNode = this.idMap.get(resolvedStateId);
		if (!stateNode) throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
		return getStateNodeByPath(stateNode, relativePath);
	}
	get definition() {
		return this.root.definition;
	}
	toJSON() {
		return this.definition;
	}
	getPersistedSnapshot(snapshot, options) {
		return getPersistedSnapshot(snapshot, options);
	}
	restoreSnapshot(snapshot, _actorScope) {
		const children = {};
		const snapshotChildren = snapshot.children;
		Object.keys(snapshotChildren).forEach((actorId) => {
			const actorData = snapshotChildren[actorId];
			const childState = actorData.snapshot;
			const src = actorData.src;
			const logic = typeof src === "string" ? resolveReferencedActor(this, src) : src;
			if (!logic) return;
			const actorRef = createActor(logic, {
				id: actorId,
				parent: _actorScope.self,
				syncSnapshot: actorData.syncSnapshot,
				snapshot: childState,
				src,
				systemId: actorData.systemId
			});
			children[actorId] = actorRef;
		});
		function resolveHistoryReferencedState(root, referenced) {
			if (referenced instanceof StateNode) return referenced;
			try {
				return root.machine.getStateNodeById(referenced.id);
			} catch {}
		}
		function reviveHistoryValue(root, historyValue) {
			if (!historyValue || typeof historyValue !== "object") return {};
			const revived = {};
			for (const key in historyValue) {
				const arr = historyValue[key];
				for (const item of arr) {
					const resolved = resolveHistoryReferencedState(root, item);
					if (!resolved) continue;
					revived[key] ??= [];
					revived[key].push(resolved);
				}
			}
			return revived;
		}
		const revivedHistoryValue = reviveHistoryValue(this.root, snapshot.historyValue);
		const restoredSnapshot = createMachineSnapshot({
			...snapshot,
			children,
			_nodes: Array.from(getAllStateNodes(getStateNodes(this.root, snapshot.value))),
			historyValue: revivedHistoryValue
		}, this);
		const seen = /* @__PURE__ */ new Set();
		function reviveContext(contextPart, children) {
			if (seen.has(contextPart)) return;
			seen.add(contextPart);
			for (const key in contextPart) {
				const value = contextPart[key];
				if (value && typeof value === "object") {
					if ("xstate$$type" in value && value.xstate$$type === 1) {
						contextPart[key] = children[value.id];
						continue;
					}
					reviveContext(value, children);
				}
			}
		}
		reviveContext(restoredSnapshot.context, children);
		return restoredSnapshot;
	}
};
// node_modules/.pnpm/xstate@5.33.4/node_modules/xstate/dist/xstate.esm.js
/**
* Creates a state machine (statechart) with the given configuration.
*
* The state machine represents the pure logic of a state machine actor.
*
* @example
*
* ```ts
* import { createMachine } from 'xstate';
*
* const lightMachine = createMachine({
*   id: 'light',
*   initial: 'green',
*   states: {
*     green: {
*       on: {
*         TIMER: { target: 'yellow' }
*       }
*     },
*     yellow: {
*       on: {
*         TIMER: { target: 'red' }
*       }
*     },
*     red: {
*       on: {
*         TIMER: { target: 'green' }
*       }
*     }
*   }
* });
*
* const lightActor = createActor(lightMachine);
* lightActor.start();
*
* lightActor.send({ type: 'TIMER' });
* ```
*
* @param config The state machine configuration.
* @param options DEPRECATED: use `setup({ ... })` or `machine.provide({ ... })`
*   to provide machine implementations instead.
*/
function createMachine(config, implementations) {
	return new StateMachine(config, implementations);
}
/** @internal */
function createInertActorScope(actorLogic) {
	const self = createActor(actorLogic);
	const freshSystem = createSystem(self, {
		clock: self.system._clock,
		logger: self.system._logger
	});
	self.system = freshSystem;
	return {
		self,
		defer: () => {},
		id: "",
		logger: () => {},
		sessionId: "",
		stopChild: () => {},
		system: freshSystem,
		emit: () => {},
		actionExecutor: () => {}
	};
}
/**
* Given actor `logic`, a `snapshot`, and an `event`, returns a tuple of the
* `nextSnapshot` and `actions` to execute.
*
* This is a pure function that does not execute `actions`.
*/
function transition(logic, snapshot, event) {
	const executableActions = [];
	const actorScope = createInertActorScope(logic);
	actorScope.actionExecutor = (action) => {
		executableActions.push(action);
	};
	return [logic.transition(snapshot, event, actorScope), executableActions];
}
// src/client/theme.machine.ts
/**
* Конечный автомат слоя темы — зеркало модели
* `extensions/dsh/machines/machines/runlark-theme.mjs`.
*
* Единственный вход — подтверждённый Host-выбор: `runlark` ставит ровно один
* слой токенов, `default` (и пропавшее значение) снимает его, dispose
* терминален. Переходы только через `themeLayerNext`: запрещённое событие
* бросает, а не игнорируется.
*
* @module @dev-platform/runlark-theme/src/client/theme.machine
*/
/** Автомат жизненного цикла слоя темы. */
const themeLayerMachine = createMachine({
	id: "themeLayer",
	initial: "unloaded",
	description: "Runlark theme override: at most one layer, driven by the confirmed form snapshot.",
	states: {
		unloaded: { on: {
			SELECT_RUNLARK: "runlark",
			SELECT_DEFAULT: "default"
		} },
		default: { on: {
			SELECT_RUNLARK: "runlark",
			SELECT_DEFAULT: "default",
			DISPOSE: "disposed"
		} },
		runlark: { on: {
			SELECT_DEFAULT: "default",
			SELECT_RUNLARK: "runlark",
			DISPOSE: "disposed"
		} },
		disposed: { type: "final" }
	}
});
/**
* Чистый строгий переход по автомату.
*
* @param state - текущее состояние.
* @param event - имя события автомата.
* @returns следующее состояние.
* @throws Error, если событие не определено в текущем состоянии.
*/
function themeLayerNext(state, event) {
	const snapshot = themeLayerMachine.resolveState({ value: state });
	const eventObject = { type: event };
	if (!snapshot.can(eventObject)) throw new Error(`illegal transition: ${state} --${event}-->`);
	return transition(themeLayerMachine, snapshot, eventObject)[0].value;
}
// src/client/tokens.ts
/** Полный слой темы: 27 alias/specific-токенов, у каждого обе схемы. */
const RUNLARK_TOKENS = {
	"--dsw-alias-bg-base": {
		light: "#F3F4F6",
		dark: "#1B1E25"
	},
	"--dsw-alias-bg-layer-1": {
		light: "#FFFFFF",
		dark: "#20232B"
	},
	"--dsw-alias-bg-layer-2": {
		light: "#FFFCF3",
		dark: "#2B2F39"
	},
	"--dsw-alias-bg-overlay": {
		light: "#FFFFFF",
		dark: "#30343E"
	},
	"--dsw-alias-bg-document-selection": {
		light: "rgba(237, 184, 48, 0.35)",
		dark: "rgba(237, 184, 48, 0.3)"
	},
	"--dsw-alias-label-primary": {
		light: "#20232B",
		dark: "#E0E4EB"
	},
	"--dsw-alias-label-secondary": {
		light: "#646B79",
		dark: "#AEB7C7"
	},
	"--dsw-alias-label-primary-inverted": {
		light: "#FFFFFF",
		dark: "#20232B"
	},
	"--dsw-alias-border-l1": {
		light: "#DFE2E8",
		dark: "#30343E"
	},
	"--dsw-alias-border-l2": {
		light: "#D4D8E0",
		dark: "#41444D"
	},
	"--dsw-alias-brand-primary": {
		light: "#B88A1F",
		dark: "#EDB830"
	},
	"--dsw-alias-brand-text": {
		light: "#20232B",
		dark: "#E0E4EB"
	},
	"--dsw-alias-state-error-primary": {
		light: "#C0392B",
		dark: "#D67E75"
	},
	"--dsw-alias-state-idle-primary": {
		light: "#5B6475",
		dark: "#848B98"
	},
	"--dsw-alias-state-success-primary": {
		light: "#2E7D4F",
		dark: "#77AB8D"
	},
	"--dsw-alias-state-warn-primary": {
		light: "#B88A1F",
		dark: "#EDB830"
	},
	"--dsw-alias-state-business-primary": {
		light: "#916C18",
		dark: "#EDB830"
	},
	"--dsw-specific-sidebar-fill": {
		light: "#F3F4F6",
		dark: "#20232B"
	},
	"--dsw-specific-sidebar-nav-item-active": {
		light: "#FBF2D8",
		dark: "#2B2F39"
	},
	"--dsw-specific-sidebar-nav-item-active-accent": {
		light: "#FBF2D8",
		dark: "#4E4837"
	},
	"--dsw-alias-button-primary-fill": {
		light: "#20232B",
		dark: "#EDB830"
	},
	"--dsw-alias-button-primary-hover": {
		light: "#2B2F39",
		dark: "#F3D77A"
	},
	"--dsw-alias-interactive-bg-hover": {
		light: "rgba(32, 35, 43, 0.06)",
		dark: "rgba(224, 228, 235, 0.08)"
	},
	"--dsw-alias-interactive-bg-hover-solid": {
		light: "#DFE2E8",
		dark: "#2B2F39"
	},
	"--dsw-alias-interactive-bg-hover-accent": {
		light: "rgba(237, 184, 48, 0.16)",
		dark: "rgba(237, 184, 48, 0.22)"
	},
	"--dsw-alias-interactive-bg-active": {
		light: "rgba(32, 35, 43, 0.1)",
		dark: "rgba(224, 228, 235, 0.14)"
	},
	"--dsw-focus-ring-color": {
		light: "#916C18",
		dark: "#F3D77A"
	}
};
Object.freeze(Object.keys(RUNLARK_TOKENS));
// src/client/theme-layer.ts
/** Идентификатор слоя в ThemeRuntime и в диагностике. */
const THEME_LAYER_SOURCE = "@dev-platform/runlark-theme";
/** Состояние применённого слоя; им управляет только автомат. */
var ThemeLayer = class {
	theme;
	source;
	state = "unloaded";
	disposeLayer;
	/**
	* @param theme - сервис темы Harness.
	* @param source - идентификатор слоя; по умолчанию package id.
	*/
	constructor(theme, source = THEME_LAYER_SOURCE) {
		this.theme = theme;
		this.source = source;
	}
	/**
	* Привести слой в соответствие подтверждённому выбору.
	*
	* @param selection - принятое Host-значение; `undefined` (форма ещё
	*   недоступна/значение пропало) трактуется как `default`.
	* @throws Error после `dispose()` — терминальное состояние.
	*/
	apply(selection) {
		this.moveTo(themeLayerNext(this.state, selection === "runlark" ? "SELECT_RUNLARK" : "SELECT_DEFAULT"));
	}
	/** Снять слой и завершить автомат (disable/unload/HMR); идемпотентен. */
	dispose() {
		if (this.state === "disposed" || this.state === "unloaded") return;
		this.moveTo(themeLayerNext(this.state, "DISPOSE"));
	}
	/** Текущий применённый выбор (для тестов и диагностики). */
	get selection() {
		return this.state === "runlark" || this.state === "default" ? this.state : void 0;
	}
	/** Применить новое состояние автомата к слою токенов. */
	moveTo(state) {
		const previous = this.state;
		this.state = state;
		if (state === "runlark" && previous !== "runlark") this.disposeLayer = this.theme.overrideTokens(this.source, RUNLARK_TOKENS);
		else if (state !== "runlark" && previous === "runlark") {
			this.disposeLayer?.();
			this.disposeLayer = void 0;
		}
	}
};
// src/client/index.ts
/** Id записи настроек и слота; совпадает с id в cordis.patch.yml. */
const ENTRY_ID = "runlark-theme";
/** Сервисы, необходимые до первого обращения. */
const inject = [
	"theme",
	"slots",
	"locale",
	"configForms"
];
/**
* Подключить тему к клиенту Harness.
*
* @param ctx - клиентский Cordis-контекст.
*/
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, "ru", ru), "runlark-theme: Russian dictionary");
	ctx.effect(() => ctx.locale.register(NS, "en", en), "runlark-theme: English dictionary");
	const form = ctx.configForms.get(ENTRY_ID);
	const layer = new ThemeLayer(ctx.theme);
	ctx.effect(() => {
		const sync = () => {
			const snapshot = form.getSnapshot();
			layer.apply(snapshot.status === "unavailable" ? void 0 : snapshot.value?.selection);
		};
		const unsubscribe = form.subscribe(sync);
		sync();
		return () => {
			unsubscribe();
			layer.dispose();
		};
	}, "runlark-theme: accepted theme layer");
	ctx.slots.inject("settings.general.item", () => ctx.slots.register({
		name: "settings.general.item",
		id: ENTRY_ID,
		order: 10.5,
		locale: NS,
		inject: () => ({ form })
	}, AppearanceThemeRow));
}
exports.ENTRY_ID = ENTRY_ID;
exports.apply = apply;
exports.inject = inject;

return module.exports; }});