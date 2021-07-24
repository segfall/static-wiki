!(function (e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var r = t();
        for (var n in r) ("object" == typeof exports ? exports : e)[n] = r[n];
    }
})(this, function () {
    return (() => {
        var __webpack_modules__ = {
                870: (e, t, r) => {
                    "use strict";
                    r.r(t), r.d(t, { createEndpoint: () => o, expose: () => l, proxy: () => g, proxyMarker: () => n, releaseProxy: () => i, transfer: () => _, transferHandlers: () => u, windowEndpoint: () => v, wrap: () => f });
                    const n = Symbol("Comlink.proxy"),
                        o = Symbol("Comlink.endpoint"),
                        i = Symbol("Comlink.releaseProxy"),
                        s = Symbol("Comlink.thrown"),
                        a = (e) => ("object" == typeof e && null !== e) || "function" == typeof e,
                        u = new Map([
                            [
                                "proxy",
                                {
                                    canHandle: (e) => a(e) && e[n],
                                    serialize(e) {
                                        const { port1: t, port2: r } = new MessageChannel();
                                        return l(e, t), [r, [r]];
                                    },
                                    deserialize: (e) => (e.start(), f(e)),
                                },
                            ],
                            [
                                "throw",
                                {
                                    canHandle: (e) => a(e) && s in e,
                                    serialize({ value: e }) {
                                        let t;
                                        return (t = e instanceof Error ? { isError: !0, value: { message: e.message, name: e.name, stack: e.stack } } : { isError: !1, value: e }), [t, []];
                                    },
                                    deserialize(e) {
                                        if (e.isError) throw Object.assign(new Error(e.value.message), e.value);
                                        throw e.value;
                                    },
                                },
                            ],
                        ]);
                    function l(e, t = self) {
                        t.addEventListener("message", function r(n) {
                            if (!n || !n.data) return;
                            const { id: o, type: i, path: a } = Object.assign({ path: [] }, n.data),
                                u = (n.data.argumentList || []).map(b);
                            let f;
                            if (u[0] === "stop") {
                                self.close();
                                return;
                            }
                            try {
                                const t = a.slice(0, -1).reduce((e, t) => e[t], e),
                                    r = a.reduce((e, t) => e[t], e);
                                switch (i) {
                                    case 0:
                                        f = r;
                                        break;
                                    case 1:
                                        (t[a.slice(-1)[0]] = b(n.data.value)), (f = !0);
                                        break;
                                    case 2:
                                        f = r.apply(t, u);
                                        break;
                                    case 3:
                                        f = g(new r(...u));
                                        break;
                                    case 4:
                                    {
                                        const { port1: t, port2: r } = new MessageChannel();
                                        l(e, r), (f = _(t, [t]));
                                    }
                                        break;
                                    case 5:
                                        f = void 0;
                                }
                            } catch (e) {
                                f = { value: e, [s]: 0 };
                            }
                            Promise.resolve(f)
                                .catch((e) => ({ value: e, [s]: 0 }))
                                .then((e) => {
                                    const [n, s] = y(e);
                                    t.postMessage(Object.assign(Object.assign({}, n), { id: o }), s), 5 === i && (t.removeEventListener("message", r), c(t));
                                });
                        }),
                        t.start && t.start();
                    }
                    function c(e) {
                        (function (e) {
                            return "MessagePort" === e.constructor.name;
                        })(e) && e.close();
                    }
                    function f(e, t) {
                        return h(e, [], t);
                    }
                    function d(e) {
                        if (e) throw new Error("Proxy has been released and is not useable");
                    }
                    function h(e, t = [], r = function () {}) {
                        let n = !1;
                        const s = new Proxy(r, {
                            get(r, o) {
                                if ((d(n), o === i))
                                    return () =>
                                        w(e, { type: 5, path: t.map((e) => e.toString()) }).then(() => {
                                            c(e), (n = !0);
                                        });
                                if ("then" === o) {
                                    if (0 === t.length) return { then: () => s };
                                    const r = w(e, { type: 0, path: t.map((e) => e.toString()) }).then(b);
                                    return r.then.bind(r);
                                }
                                return h(e, [...t, o]);
                            },
                            set(r, o, i) {
                                d(n);
                                const [s, a] = y(i);
                                return w(e, { type: 1, path: [...t, o].map((e) => e.toString()), value: s }, a).then(b);
                            },
                            apply(r, i, s) {
                                d(n);
                                const a = t[t.length - 1];
                                if (a === o) return w(e, { type: 4 }).then(b);
                                if ("bind" === a) return h(e, t.slice(0, -1));
                                const [u, l] = p(s);
                                return w(e, { type: 2, path: t.map((e) => e.toString()), argumentList: u }, l).then(b);
                            },
                            construct(r, o) {
                                d(n);
                                const [i, s] = p(o);
                                return w(e, { type: 3, path: t.map((e) => e.toString()), argumentList: i }, s).then(b);
                            },
                        });
                        return s;
                    }
                    function p(e) {
                        const t = e.map(y);
                        return [t.map((e) => e[0]), ((r = t.map((e) => e[1])), Array.prototype.concat.apply([], r))];
                        var r;
                    }
                    const m = new WeakMap();
                    function _(e, t) {
                        return m.set(e, t), e;
                    }
                    function g(e) {
                        return Object.assign(e, { [n]: !0 });
                    }
                    function v(e, t = self, r = "*") {
                        return { postMessage: (t, n) => e.postMessage(t, r, n), addEventListener: t.addEventListener.bind(t), removeEventListener: t.removeEventListener.bind(t) };
                    }
                    function y(e) {
                        for (const [t, r] of u)
                            if (r.canHandle(e)) {
                                const [n, o] = r.serialize(e);
                                return [{ type: 3, name: t, value: n }, o];
                            }
                        return [{ type: 0, value: e }, m.get(e) || []];
                    }
                    function b(e) {
                        switch (e.type) {
                            case 3:
                                return u.get(e.name).deserialize(e.value);
                            case 0:
                                return e.value;
                        }
                    }
                    function w(e, t, r) {
                        return new Promise((n) => {
                            const o = new Array(4)
                                .fill(0)
                                .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
                                .join("-");
                            e.addEventListener("message", function t(r) {
                                r.data && r.data.id && r.data.id === o && (e.removeEventListener("message", t), n(r.data));
                            }),
                            e.start && e.start(),
                                e.postMessage(Object.assign({ id: o }, t), r);
                        });
                    }
                },
                794: (e, t) => {
                    "use strict";
                    Object.defineProperty(t, "__esModule", { value: !0 }), (t.createLazyFile = t.LazyUint8Array = void 0);
                    class r {
                        constructor(e) {
                            (this.serverChecked = !1),
                                (this.chunks = []),
                                (this.totalFetchedBytes = 0),
                                (this.totalRequests = 0),
                                (this.readPages = []),
                                (this.readHeads = []),
                                (this.lastGet = -1),
                                (this._chunkSize = e.requestChunkSize),
                                (this.maxSpeed = Math.round((e.maxReadSpeed || 5242880) / this._chunkSize)),
                                (this.maxReadHeads = e.maxReadHeads ?? 3),
                                (this.rangeMapper = e.rangeMapper),
                                (this.logPageReads = e.logPageReads ?? !1),
                            e.fileLength && (this._length = e.fileLength);
                            this.stop = 0;
                        }
                        copyInto(e, t, r, n) {
                            if (n >= this.length) return 0;
                            const o = n + (r = Math.min(this.length - n, r));
                            let i = 0;
                            for (; i < r; ) {
                                const r = n + i,
                                    s = r % this.chunkSize,
                                    a = (r / this.chunkSize) | 0,
                                    u = Math.min(this.chunkSize, o - r);
                                let l = this.getChunk(a);
                                (0 === s && u === this.chunkSize) || (l = l.subarray(s, s + u)), e.set(l, t + i), (i += l.length);
                            }
                            return r;
                        }
                        moveReadHead(e) {
                            for (const [t, r] of this.readHeads.entries()) {
                                const n = r.startChunk + r.speed,
                                    o = Math.min(this.maxSpeed, 2 * r.speed);
                                if (e >= n && e < n + o) return (r.speed = o), (r.startChunk = n), 0 !== t && (this.readHeads.splice(t, 1), this.readHeads.unshift(r)), r;
                            }
                            const t = { startChunk: e, speed: 1 };
                            for (this.readHeads.unshift(t); this.readHeads.length > this.maxReadHeads; ) this.readHeads.pop();
                            return t;
                        }
                        getChunk(e) {
                            let t = !0;
                            if (void 0 === this.chunks[e]) {
                                t = !1;
                                const r = this.moveReadHead(e),
                                    n = r.speed,
                                    o = r.startChunk * this.chunkSize;
                                let i = (r.startChunk + n) * this.chunkSize - 1;
                                i = Math.min(i, this.length - 1);
                                const s = this.doXHR(o, i);
                                for (let e = 0; e < n; e++) {
                                    const t = r.startChunk + e;
                                    if (e * this.chunkSize >= s.byteLength) break;
                                    const n = (e + 1) * this.chunkSize > s.byteLength ? s.byteLength - e * this.chunkSize : this.chunkSize;
                                    this.chunks[t] = new Uint8Array(s, e * this.chunkSize, n);
                                }
                            }
                            if (void 0 === this.chunks[e]) throw new Error("doXHR failed (bug)!");
                            return !this.logPageReads || this.lastGet == e || ((this.lastGet = e), this.readPages.push({ pageno: e, wasCached: t, prefetch: t ? 0 : this.readHeads[0].speed - 1 })), this.chunks[e];
                        }
                        checkServer() {
                            var e = new XMLHttpRequest();
                            const t = this.rangeMapper(0, 0).url;
                            if ((e.open("HEAD", t, !1), e.send(null), !((e.status >= 200 && e.status < 300) || 304 === e.status))) throw new Error("Couldn't load " + t + ". Status: " + e.status);
                            var r = Number(e.getResponseHeader("Content-length")),
                                n = "bytes" === e.getResponseHeader("Accept-Ranges"),
                                o = "gzip" === e.getResponseHeader("Content-Encoding");
                            if (!n) {
                                const t = "server does not support byte serving (`Accept-Ranges: bytes` header missing), or your database is hosted on CORS and the server doesn't mark the accept-ranges header as exposed";
                                console.error(t, "seen response headers", e.getAllResponseHeaders());
                            }
                            if (o || !r) throw (console.error("response headers", e.getAllResponseHeaders()), Error("server uses gzip or doesn't have length"));
                            this._length || (this._length = r), (this.serverChecked = !0);
                        }
                        get length() {
                            return this.serverChecked || this.checkServer(), this._length;
                        }
                        get chunkSize() {
                            return this.serverChecked || this.checkServer(), this._chunkSize;
                        }
                        doXHR(e, t) {
                            // if (this.stop > 100) {
                            //     this.stop = 0;
                            //     throw new Error("Timeout exceeded");
                            // }
                            this.stop++;
                            if ((console.log(`[xhr of size ${(t + 1 - e) / 1024} KiB @ ${e / 1024} KiB]`), (this.totalFetchedBytes += t - e), this.totalRequests++, e > t))
                                throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
                            if (t > this.length - 1) throw new Error("only " + this.length + " bytes available! programmer error!");
                            const { fromByte: r, toByte: n, url: o } = this.rangeMapper(e, t);
                            var i = new XMLHttpRequest();
                            if (
                                (i.open("GET", o, !1),
                                this.length !== this.chunkSize && i.setRequestHeader("Range", "bytes=" + r + "-" + n),
                                    (i.responseType = "arraybuffer"),
                                i.overrideMimeType && i.overrideMimeType("text/plain; charset=x-user-defined"),
                                    i.send(null),
                                    !((i.status >= 200 && i.status < 300) || 304 === i.status))
                            )
                                throw new Error("Couldn't load " + o + ". Status: " + i.status);
                            if (void 0 !== i.response) return i.response;
                            throw Error("xhr did not return uint8array");
                        }
                    }
                    (t.LazyUint8Array = r),
                        (t.createLazyFile = function (e, t, n, o, i, s) {
                            var a = new r(s),
                                u = { isDevice: !1, contents: a },
                                l = e.createFile(t, n, u, o, i);
                            (l.contents = a),
                                Object.defineProperties(l, {
                                    usedBytes: {
                                        get: function () {
                                            return this.contents.length;
                                        },
                                    },
                                });
                            var c = {};
                            return (
                                Object.keys(l.stream_ops).forEach(function (t) {
                                    var r = l.stream_ops[t];
                                    c[t] = function () {
                                        return e.forceLoadFile(l), r.apply(null, arguments);
                                    };
                                }),
                                    (c.read = function (t, r, n, o, i) {
                                        return e.forceLoadFile(l), t.node.contents.copyInto(r, n, o, i);
                                    }),
                                    (l.stream_ops = c),
                                    l
                            );
                        });
                },
                630: function (__unused_webpack_module, exports, __webpack_require__) {
                    "use strict";
                    var __createBinding =
                        (this && this.__createBinding) ||
                        (Object.create
                            ? function (e, t, r, n) {
                                void 0 === n && (n = r),
                                    Object.defineProperty(e, n, {
                                        enumerable: !0,
                                        get: function () {
                                            return t[r];
                                        },
                                    });
                            }
                            : function (e, t, r, n) {
                                void 0 === n && (n = r), (e[n] = t[r]);
                            }),
                        __setModuleDefault =
                            (this && this.__setModuleDefault) ||
                            (Object.create
                                ? function (e, t) {
                                    Object.defineProperty(e, "default", { enumerable: !0, value: t });
                                }
                                : function (e, t) {
                                    e.default = t;
                                }),
                        __importStar =
                            (this && this.__importStar) ||
                            function (e) {
                                if (e && e.__esModule) return e;
                                var t = {};
                                if (null != e) for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && __createBinding(t, e, r);
                                return __setModuleDefault(t, e), t;
                            },
                        __importDefault =
                            (this && this.__importDefault) ||
                            function (e) {
                                return e && e.__esModule ? e : { default: e };
                            };
                    Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.toObjects = void 0);
                    const Comlink = __importStar(__webpack_require__(870)),
                        sql_wasm_js_1 = __importDefault(__webpack_require__(365)),
                        sql_wasm_wasm_1 = __importDefault(__webpack_require__(720)),
                        lazyFile_1 = __webpack_require__(794),
                        vtab_1 = __webpack_require__(457);
                    function initTransferHandlers(e) {
                        Comlink.transferHandlers.set("WORKERSQLPROXIES", {
                            canHandle: (t) => {
                                let r = t instanceof e.Database,
                                    n = t && t.db && t.db instanceof e.Database;
                                return r || n;
                            },
                            serialize(e) {
                                const { port1: t, port2: r } = new MessageChannel();
                                return Comlink.expose(e, t), [r, [r]];
                            },
                            deserialize: (e) => {},
                        });
                    }
                    async function init(e) {
                        const t = await sql_wasm_js_1.default({ locateFile: (t) => e });
                        return initTransferHandlers(t), t;
                    }
                    function toObjects(e) {
                        return e.flatMap((e) =>
                            e.values.map((t) => {
                                const r = {};
                                for (let n = 0; n < e.columns.length; n++) r[e.columns[n]] = t[n];
                                return r;
                            })
                        );
                    }
                    async function fetchConfigs(e) {
                        const t = e.map(async (e) => {
                            if ("jsonconfig" === e.from) {
                                const t = new URL(e.configUrl, location.href),
                                    r = await fetch(t.toString());
                                if (!r.ok) throw (console.error("httpvfs config error", await r.text()), Error(`Could not load httpvfs config: ${r.status}: ${r.statusText}`));
                                const n = await r.json();
                                return { from: "inline", config: "chunked" === n.serverMode ? { ...n, urlPrefix: new URL(n.urlPrefix, t).toString() } : { ...n, url: new URL(n.url, t).toString() }, virtualFilename: e.virtualFilename };
                            }
                            return e;
                        });
                        return Promise.all(t);
                    }
                    sql_wasm_wasm_1.default, (exports.toObjects = toObjects);
                    const mod = {
                        db: null,
                        inited: !1,
                        sqljs: null,
                        async SplitFileHttpDatabase(e, t, r) {
                            if (this.inited) throw Error("sorry, only one db is supported right now");
                            (this.inited = !0), this.sqljs || (this.sqljs = init(e));
                            const n = await this.sqljs,
                                o = new Map(),
                                i = await fetchConfigs(t);
                            let s;
                            for (const { config: e, virtualFilename: t } of i) {
                                const i = "chunked" === e.serverMode ? e.urlPrefix : e.url;
                                let a;
                                console.log("constructing url database", i),
                                    (a =
                                        "chunked" == e.serverMode
                                            ? (t, r) => {
                                                const n = (t / e.serverChunkSize) | 0,
                                                    o = t % e.serverChunkSize,
                                                    i = o + (r - t);
                                                return { url: e.urlPrefix + String(n).padStart(3, "0"), fromByte: o, toByte: i };
                                            }
                                            : (t, r) => ({ url: e.url, fromByte: t, toByte: r }));
                                const u = t || i.replace(/\//g, "_");
                                r || ((r = u), (s = e)), console.log("filename", u), console.log("constructing url database", i, "filename", u);
                                const l = lazyFile_1.createLazyFile(n.FS, "/", u, !0, !0, {
                                    rangeMapper: a,
                                    requestChunkSize: e.requestChunkSize,
                                    fileLength: "chunked" === e.serverMode ? e.databaseLengthBytes : void 0,
                                    logPageReads: !0,
                                    maxReadHeads: 3,
                                });
                                o.set(u, l);
                            }
                            if (((this.db = new n.CustomDatabase(r)), s)) {
                                const e = (await this.db.exec("pragma page_size; pragma cache_size=0"))[0].values[0][0];
                                e !== s.requestChunkSize && console.warn(`Chunk size does not match page size: pragma page_size = ${e} but chunkSize = ${s.requestChunkSize}`);
                            }
                            return (this.db.lazyFiles = o), this.db.create_vtab(vtab_1.SeriesVtab), (this.db.query = (...e) => toObjects(this.db.exec(...e))), this.db;
                        },
                        getResetAccessedPages(e) {
                            if (!this.db) return [];
                            const t = this.db.lazyFiles.get(e || this.db.filename);
                            if (!t) throw Error("unknown lazy file");
                            const r = [...t.contents.readPages];
                            return (t.contents.readPages = []), r;
                        },
                        getStats(e) {
                            const t = this.db;
                            if (!t) return null;
                            const r = t.lazyFiles.get(e || t.filename);
                            if (!r) throw Error("unknown lazy file");
                            return { filename: t.filename, totalBytes: r.contents.length, totalFetchedBytes: r.contents.totalFetchedBytes, totalRequests: r.contents.totalRequests };
                        },
                        async evalCode(code) {
                            return await eval(`(async function (db) {\n      ${code}\n    })`)(this.db);
                        },
                    };
                    Comlink.expose(mod);
                },
                457: (e, t) => {
                    "use strict";
                    var r;
                    Object.defineProperty(t, "__esModule", { value: !0 }),
                        (t.SeriesVtab = void 0),
                        (function (e) {
                            (e[(e.idx = 0)] = "idx"),
                                (e[(e.id = 1)] = "id"),
                                (e[(e.tagName = 2)] = "tagName"),
                                (e[(e.textContent = 3)] = "textContent"),
                                (e[(e.innerHTML = 4)] = "innerHTML"),
                                (e[(e.outerHTML = 5)] = "outerHTML"),
                                (e[(e.className = 6)] = "className"),
                                (e[(e.parent = 7)] = "parent"),
                                (e[(e.selector = 8)] = "selector"),
                                (e[(e.querySelector = 9)] = "querySelector");
                        })(r || (r = {}));
                    const n = Object.keys(r)
                        .map((e) => r[e])
                        .filter((e) => "string" == typeof e);
                    function o(e) {
                        const t = {};
                        for (let n = 0; n < e.length; n++) t[r[n]] = e[n];
                        return t;
                    }
                    function i(e) {
                        const t = new SharedArrayBuffer(1048576),
                            r = new Int32Array(t, 0, 2);
                        (r[0] = 1), self.postMessage({ action: "eval", notify: t, request: e }), Atomics.wait(r, 0, 1);
                        const n = r[1],
                            o = new Uint8Array(t, 8, n).slice(),
                            i = new TextDecoder().decode(o),
                            s = JSON.parse(i);
                        if ("err" in s) throw new Error(s.err);
                        return s.ok;
                    }
                    t.SeriesVtab = class {
                        constructor(e, t) {
                            (this.module = e), (this.db = t), (this.name = "dom"), (this.iVersion = 2), (this.cursors = new Map()), console.log("constructed vfs");
                        }
                        getCursor(e) {
                            const t = this.cursors.get(e);
                            if (!t) throw Error("impl error");
                            return t;
                        }
                        xConnect(e, t, r, o, i, s) {
                            console.log("xconnect!!"),
                                this.db.handleError(this.module.ccall("sqlite3_declare_vtab", "number", ["number", "string"], [e, `create table x(\n              ${n.slice(0, -1).join(", ")} PRIMARY KEY\n          ) WITHOUT ROWID`]));
                            const a = this.module._malloc(12);
                            return this.module.setValue(i, a, "*"), 0;
                        }
                        xDisconnect(e) {
                            return this.module._free(e), 0;
                        }
                        xOpen(e, t) {
                            const r = this.module._malloc(4);
                            return this.cursors.set(r, { elements: [], index: 0, querySelector: "" }), this.module.setValue(t, r, "*"), 0;
                        }
                        xClose(e) {
                            return this.module._free(e), 0;
                        }
                        xBestIndex(e, t) {
                            try {
                                const e = this.module.getValue(t + 0, "i32"),
                                    n = this.module.getValue(t + 4, "i32"),
                                    o = 64;
                                let i = !1;
                                for (let s = 0; s < e; s++) {
                                    const e = n + 12 * s,
                                        a = this.module.getValue(e, "i32"),
                                        u = this.module.getValue(e + 4, "i8");
                                    if (this.module.getValue(e + 5, "i8")) {
                                        if (u === o) {
                                            if (a !== r.selector) throw Error("The match operator can only be applied to the selector column!");
                                            {
                                                i = !0;
                                                const e = this.module.getValue(t + 16, "i32"),
                                                    r = 8;
                                                this.module.setValue(e + s * r, 1, "i32");
                                            }
                                        }
                                        console.log(`constraint ${s}: ${r[a]} (op=${u})`);
                                    }
                                }
                                if (!i) throw Error("You must query the dom using `select ... from dom where selector MATCH <css-selector>`");
                                const s = this.module.getValue(t + 64, "i32");
                                return this.module.setValue(t + 20, s, "i32"), 0;
                            } catch (t) {
                                return console.error("xbestindex", t), this.setVtabError(e, String(t)), 21;
                            }
                        }
                        xFilter(e, t, o, s, a) {
                            if ((console.log("xfilter", s), 1 !== s)) return console.error("did not get a single argument to xFilter"), 21;
                            const u = this.module.extract_value(a + 0),
                                l = this.getCursor(e);
                            l.querySelector = u;
                            const c = t,
                                f = n.filter((e) => c & (1 << r[e]));
                            return console.log("used columns", f), (l.elements = i({ type: "select", selector: u, columns: f })), 0;
                        }
                        xNext(e) {
                            return this.getCursor(e).index++, 0;
                        }
                        xEof(e) {
                            const t = this.getCursor(e);
                            return +(t.index >= t.elements.length);
                        }
                        xColumn(e, t, n) {
                            const o = this.getCursor(e),
                                i = o.elements[o.index];
                            if (r[n] in i) this.module.set_return_value(t, i[r[n]]);
                            else
                                switch (n) {
                                    case r.idx:
                                        this.module.set_return_value(t, o.index);
                                        break;
                                    case r.querySelector:
                                        this.module.set_return_value(t, o.querySelector);
                                        break;
                                    default:
                                        throw Error(`unknown column ${r[n]}`);
                                }
                            return 0;
                        }
                        setVtabError(e, t) {
                            const r = this.module.lengthBytesUTF8(t) + 1,
                                n = this.module.sqlite3_malloc(r);
                            console.log("writing error", t, r), this.module.stringToUTF8(t, n, r), this.module.setValue(e + 8, n, "i32");
                        }
                        xUpdate(e, t, r, n) {
                            try {
                                const [e, n, ...s] = Array.from({ length: t }, (e, t) => this.module.extract_value(r + 4 * t));
                                if (e)
                                    if (e && !n) console.log("DELETE", e), i({ type: "delete", selector: e });
                                    else {
                                        if (e !== n) throw "The selector row can't be set";
                                        i({ type: "update", value: o(s) });
                                    }
                                else console.assert(null === n), i({ type: "insert", value: o(s) });
                                return 0;
                            } catch (t) {
                                return this.setVtabError(e, String(t)), 21;
                            }
                        }
                        xRowid(e, t) {
                            throw Error("xRowid not implemented");
                        }
                        xFindFunction(e, t, r, n, o) {
                            return "match" !== this.module.UTF8ToString(r)
                                ? 0
                                : (this.module.setValue(
                                    n,
                                    this.module.addFunction((e, t, r) => {
                                        this.module.set_return_value(e, !0);
                                    }, "viii"),
                                    "i32"
                                ),
                                    150);
                        }
                    };
                },
                365: (e, t, r) => {
                    e = r.nmd(e);
                    var n = void 0,
                        o = function (t) {
                            return (
                                n ||
                                (n = new Promise(function (n, o) {
                                    var i,
                                        s = (i = void 0 !== t ? t : {}).onAbort;
                                    (i.onAbort = function (e) {
                                        o(new Error(e)), s && s(e);
                                    }),
                                        (i.postRun = i.postRun || []),
                                        i.postRun.push(function () {
                                            n(i);
                                        }),
                                        (e = void 0),
                                        ((i = void 0 !== i ? i : {}).onRuntimeInitialized = function () {
                                            var e = sr(4),
                                                t = i.cwrap,
                                                r = t("sqlite3_open", "number", ["string", "number"]),
                                                n = (t("sqlite3_open_v2", "number", ["string", "number", "number", "string"]), t("sqlite3_close_v2", "number", ["number"])),
                                                o = t("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]),
                                                s = t("sqlite3_changes", "number", ["number"]),
                                                a = t("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]),
                                                u = t("sqlite3_sql", "string", ["number"]),
                                                l = t("sqlite3_normalized_sql", "string", ["number"]),
                                                c = t("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]),
                                                f = t("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]),
                                                d = t("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]),
                                                h = t("sqlite3_bind_double", "number", ["number", "number", "number"]),
                                                p = t("sqlite3_bind_int", "number", ["number", "number", "number"]),
                                                m = t("sqlite3_bind_parameter_index", "number", ["number", "string"]),
                                                _ = t("sqlite3_step", "number", ["number"]),
                                                g = t("sqlite3_errmsg", "string", ["number"]),
                                                v = t("sqlite3_column_count", "number", ["number"]),
                                                y = t("sqlite3_data_count", "number", ["number"]),
                                                b = t("sqlite3_column_double", "number", ["number", "number"]),
                                                w = t("sqlite3_column_text", "string", ["number", "number"]),
                                                E = t("sqlite3_column_blob", "number", ["number", "number"]),
                                                k = t("sqlite3_column_bytes", "number", ["number", "number"]),
                                                S = t("sqlite3_column_type", "number", ["number", "number"]),
                                                q = t("sqlite3_column_name", "string", ["number", "number"]),
                                                x = t("sqlite3_reset", "number", ["number"]),
                                                D = t("sqlite3_clear_bindings", "number", ["number"]),
                                                F = t("sqlite3_finalize", "number", ["number"]),
                                                M = t("sqlite3_create_module_v2", "number", ["number", "string", "number", "number", "number"]),
                                                P = t("sqlite3_create_function_v2", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number"]),
                                                A = t("sqlite3_value_type", "number", ["number"]),
                                                R = t("sqlite3_value_bytes", "number", ["number"]),
                                                T = t("sqlite3_value_text", "string", ["number"]),
                                                B = t("sqlite3_value_blob", "number", ["number"]),
                                                L = t("sqlite3_value_double", "number", ["number"]),
                                                N = t("sqlite3_result_double", "", ["number", "number"]),
                                                H = t("sqlite3_result_null", "", ["number"]),
                                                U = t("sqlite3_result_text", "", ["number", "string", "number", "number"]),
                                                W = t("sqlite3_result_blob", "", ["number", "number", "number", "number"]),
                                                G = t("sqlite3_result_int", "", ["number", "number"]),
                                                $ = t("sqlite3_result_error", "", ["number", "string", "number"]),
                                                K = t("sqlite3_malloc", "number", ["number"]);
                                            i.sqlite3_malloc = K;
                                            var Y = t("RegisterExtensionFunctions", "number", ["number"]);
                                            function Q(e, t) {
                                                (this.stmt = e), (this.db = t), (this.pos = 1), (this.allocatedmem = []);
                                            }
                                            function J(e, t) {
                                                this.db = t;
                                                var r = ne(e) + 1;
                                                if (((this.sqlPtr = Zt(r)), null === this.sqlPtr)) throw new Error("Unable to allocate memory for the SQL string");
                                                re(e, this.sqlPtr, r), (this.nextSqlPtr = this.sqlPtr), (this.nextSqlString = null), (this.activeStatement = null);
                                            }
                                            function Z(t) {
                                                (this.filename = "dbfile_" + ((4294967295 * Math.random()) >>> 0)), null != t && et.createDataFile("/", this.filename, t, !0, !0);
                                                const n = r(this.filename, e);
                                                (this.db = C(e, "i32")), this.handleError(n), Y(this.db), (this.statements = {}), (this.functions = {});
                                            }
                                            function te(t) {
                                                this.filename = t;
                                                const n = r(this.filename, e);
                                                (this.db = C(e, "i32")), this.handleError(n), Y(this.db), (this.statements = {}), (this.functions = {});
                                            }
                                            (Q.prototype.bind = function (e) {
                                                if (!this.stmt) throw "Statement closed";
                                                return this.reset(), Array.isArray(e) ? this.bindFromArray(e) : null == e || "object" != typeof e || this.bindFromObject(e);
                                            }),
                                                (Q.prototype.bind_ = Q.prototype.bind),
                                                (Q.prototype.step = function () {
                                                    if (!this.stmt) throw "Statement closed";
                                                    this.pos = 1;
                                                    var e = _(this.stmt);
                                                    switch (e) {
                                                        case 100:
                                                            return !0;
                                                        case 101:
                                                            return !1;
                                                        default:
                                                            throw this.db.handleError(e);
                                                    }
                                                }),
                                                (Q.prototype.getNumber = function (e) {
                                                    return null == e && ((e = this.pos), (this.pos += 1)), b(this.stmt, e);
                                                }),
                                                (Q.prototype.getString = function (e) {
                                                    return null == e && ((e = this.pos), (this.pos += 1)), w(this.stmt, e);
                                                }),
                                                (Q.prototype.getBlob = function (e) {
                                                    null == e && ((e = this.pos), (this.pos += 1));
                                                    for (var t = k(this.stmt, e), r = E(this.stmt, e), n = new Uint8Array(t), o = 0; o < t; o += 1) n[o] = X[r + o];
                                                    return n;
                                                }),
                                                (Q.prototype.get = function (e) {
                                                    null != e && this.bind(e) && this.step();
                                                    for (var t = [], r = y(this.stmt), n = 0; n < r; n += 1)
                                                        switch (S(this.stmt, n)) {
                                                            case 1:
                                                            case 2:
                                                                t.push(this.getNumber(n));
                                                                break;
                                                            case 3:
                                                                t.push(this.getString(n));
                                                                break;
                                                            case 4:
                                                                t.push(this.getBlob(n));
                                                                break;
                                                            default:
                                                                t.push(null);
                                                        }
                                                    return t;
                                                }),
                                                (Q.prototype.getColumnNames = function () {
                                                    for (var e = [], t = v(this.stmt), r = 0; r < t; r += 1) e.push(q(this.stmt, r));
                                                    return e;
                                                }),
                                                (Q.prototype.getAsObject = function (e) {
                                                    for (var t = this.get(e), r = this.getColumnNames(), n = {}, o = 0; o < r.length; o += 1) n[r[o]] = t[o];
                                                    return n;
                                                }),
                                                (Q.prototype.getSQL = function () {
                                                    return u(this.stmt);
                                                }),
                                                (Q.prototype.getNormalizedSQL = function () {
                                                    return l(this.stmt);
                                                }),
                                                (Q.prototype.run = function (e) {
                                                    return null != e && this.bind(e), this.step(), this.reset();
                                                }),
                                                (Q.prototype.bindString = function (e, t) {
                                                    null == t && ((t = this.pos), (this.pos += 1));
                                                    var r = $t(e),
                                                        n = V(r, I);
                                                    return this.allocatedmem.push(n), this.db.handleError(f(this.stmt, t, n, r.length - 1, 0)), !0;
                                                }),
                                                (Q.prototype.bindBlob = function (e, t) {
                                                    null == t && ((t = this.pos), (this.pos += 1));
                                                    var r = V(e, I);
                                                    return this.allocatedmem.push(r), this.db.handleError(d(this.stmt, t, r, e.length, 0)), !0;
                                                }),
                                                (Q.prototype.bindNumber = function (e, t) {
                                                    null == t && ((t = this.pos), (this.pos += 1));
                                                    var r = e === (0 | e) ? p : h;
                                                    return this.db.handleError(r(this.stmt, t, e)), !0;
                                                }),
                                                (Q.prototype.bindNull = function (e) {
                                                    return null == e && ((e = this.pos), (this.pos += 1)), 0 === d(this.stmt, e, 0, 0, 0);
                                                }),
                                                (Q.prototype.bindValue = function (e, t) {
                                                    switch ((null == t && ((t = this.pos), (this.pos += 1)), typeof e)) {
                                                        case "string":
                                                            return this.bindString(e, t);
                                                        case "number":
                                                        case "boolean":
                                                            return this.bindNumber(e + 0, t);
                                                        case "object":
                                                            if (null === e) return this.bindNull(t);
                                                            if (null != e.length) return this.bindBlob(e, t);
                                                    }
                                                    throw "Wrong API use : tried to bind a value of an unknown type (" + e + ").";
                                                }),
                                                (Q.prototype.bindFromObject = function (e) {
                                                    var t = this;
                                                    return (
                                                        Object.keys(e).forEach(function (r) {
                                                            var n = m(t.stmt, r);
                                                            0 !== n && t.bindValue(e[r], n);
                                                        }),
                                                            !0
                                                    );
                                                }),
                                                (Q.prototype.bindFromArray = function (e) {
                                                    for (var t = 0; t < e.length; t += 1) this.bindValue(e[t], t + 1);
                                                    return !0;
                                                }),
                                                (Q.prototype.reset = function () {
                                                    return this.freemem(), 0 === D(this.stmt) && 0 === x(this.stmt);
                                                }),
                                                (Q.prototype.freemem = function () {
                                                    for (var e; void 0 !== (e = this.allocatedmem.pop()); ) er(e);
                                                }),
                                                (Q.prototype.free = function () {
                                                    var e;
                                                    return this.freemem(), (e = 0 === F(this.stmt)), delete this.db.statements[this.stmt], (this.stmt = 0), e;
                                                }),
                                                (J.prototype.next = function () {
                                                    if (null === this.sqlPtr) return { done: !0 };
                                                    if ((null !== this.activeStatement && (this.activeStatement.free(), (this.activeStatement = null)), !this.db.db)) throw (this.finalize(), new Error("Database closed"));
                                                    var t = or(),
                                                        r = sr(4);
                                                    j(e, 0, "i32"), j(r, 0, "i32");
                                                    try {
                                                        this.db.handleError(c(this.db.db, this.nextSqlPtr, -1, e, r)), (this.nextSqlPtr = C(r, "i32"));
                                                        var n = C(e, "i32");
                                                        return 0 === n
                                                            ? (this.finalize(), { done: !0 })
                                                            : ((this.activeStatement = new Q(n, this.db)), (this.db.statements[n] = this.activeStatement), { value: this.activeStatement, done: !1 });
                                                    } catch (e) {
                                                        throw ((this.nextSqlString = ee(this.nextSqlPtr)), this.finalize(), e);
                                                    } finally {
                                                        ir(t);
                                                    }
                                                }),
                                                (J.prototype.finalize = function () {
                                                    er(this.sqlPtr), (this.sqlPtr = null);
                                                }),
                                                (J.prototype.getRemainingSQL = function () {
                                                    return null !== this.nextSqlString ? this.nextSqlString : ee(this.nextSqlPtr);
                                                }),
                                            "function" == typeof Symbol &&
                                            "symbol" == typeof Symbol.iterator &&
                                            (J.prototype[Symbol.iterator] = function () {
                                                return this;
                                            }),
                                                (Z.prototype.run = function (t, r) {
                                                    if (!this.db) throw "Database closed";
                                                    if (r) {
                                                        var n = this.prepare(t, r);
                                                        try {
                                                            n.step();
                                                        } finally {
                                                            n.free();
                                                        }
                                                    } else this.handleError(o(this.db, t, 0, 0, e));
                                                    return this;
                                                }),
                                                (Z.prototype.exec = function (t, r) {
                                                    if (!this.db) throw "Database closed";
                                                    var n = or(),
                                                        o = null;
                                                    try {
                                                        for (var i = ie(t), s = sr(4), a = []; 0 !== C(i, "i8"); ) {
                                                            j(e, 0, "i32"), j(s, 0, "i32"), this.handleError(c(this.db, i, -1, e, s));
                                                            var u = C(e, "i32");
                                                            if (((i = C(s, "i32")), 0 !== u)) {
                                                                var l = null;
                                                                for (o = new Q(u, this), null != r && o.bind(r); o.step(); ) null === l && ((l = { columns: o.getColumnNames(), values: [] }), a.push(l)), l.values.push(o.get());
                                                                o.free();
                                                            }
                                                        }
                                                        return a;
                                                    } catch (e) {
                                                        throw (o && o.free(), e);
                                                    } finally {
                                                        ir(n);
                                                    }
                                                }),
                                                (Z.prototype.each = function (e, t, r, n) {
                                                    var o;
                                                    "function" == typeof t && ((n = r), (r = t), (t = void 0)), (o = this.prepare(e, t));
                                                    try {
                                                        for (; o.step(); ) r(o.getAsObject());
                                                    } finally {
                                                        o.free();
                                                    }
                                                    if ("function" == typeof n) return n();
                                                }),
                                                (Z.prototype.prepare = function (t, r) {
                                                    j(e, 0, "i32"), this.handleError(a(this.db, t, -1, e, 0));
                                                    var n = C(e, "i32");
                                                    if (0 === n) throw "Nothing to prepare";
                                                    var o = new Q(n, this);
                                                    return null != r && o.bind(r), (this.statements[n] = o), o;
                                                }),
                                                (Z.prototype.iterateStatements = function (e) {
                                                    return new J(e, this);
                                                }),
                                                (Z.prototype.export = function () {
                                                    Object.values(this.statements).forEach(function (e) {
                                                        e.free();
                                                    }),
                                                        Object.values(this.functions).forEach(z),
                                                        (this.functions = {}),
                                                        this.handleError(n(this.db));
                                                    var t = et.readFile(this.filename, { encoding: "binary" });
                                                    return this.handleError(r(this.filename, e)), (this.db = C(e, "i32")), t;
                                                }),
                                                (Z.prototype.close = function () {
                                                    null !== this.db &&
                                                    (Object.values(this.statements).forEach(function (e) {
                                                        e.free();
                                                    }),
                                                        Object.values(this.functions).forEach(z),
                                                        (this.functions = {}),
                                                        this.handleError(n(this.db)),
                                                        et.unlink("/" + this.filename),
                                                        (this.db = null));
                                                }),
                                                (Z.prototype.handleError = function (e) {
                                                    var t;
                                                    if (0 === e) return null;
                                                    throw ((t = g(this.db)), new Error("SQLite: " + (t || "Code " + e)));
                                                }),
                                                (Z.prototype.getRowsModified = function () {
                                                    return s(this.db);
                                                }),
                                                (Z.prototype.create_function = function (e, t) {
                                                    Object.prototype.hasOwnProperty.call(this.functions, e) && (z(this.functions[e]), delete this.functions[e]);
                                                    var r = O(function (e, r, n) {
                                                        for (var o, s = [], a = 0; a < r; a += 1) s.push(i.extract_value(n + 4 * a));
                                                        try {
                                                            o = t.apply(null, s);
                                                        } catch (t) {
                                                            return void $(e, "JS threw: " + t, -1);
                                                        }
                                                        i.set_return_value(e, o);
                                                    }, "viii");
                                                    return (this.functions[e] = r), this.handleError(P(this.db, e, t.length, 1, 0, r, 0, 0, 0)), this;
                                                }),
                                                (i.extract_value = function (e) {
                                                    var t = C(e, "i32"),
                                                        r = A(t);
                                                    return 1 === r || 2 === r
                                                        ? L(t)
                                                        : 3 === r
                                                            ? T(t)
                                                            : 4 === r
                                                                ? (function (e) {
                                                                    for (var t = R(e), r = B(e), n = new Uint8Array(t), o = 0; o < t; o += 1) n[o] = X[r + o];
                                                                    return n;
                                                                })(t)
                                                                : null;
                                                }),
                                                (i.set_return_value = function (e, t) {
                                                    switch (typeof t) {
                                                        case "boolean":
                                                            G(e, t ? 1 : 0);
                                                            break;
                                                        case "number":
                                                            N(e, t);
                                                            break;
                                                        case "string":
                                                            U(e, t, -1, -1);
                                                            break;
                                                        case "object":
                                                            if (null === t) H(e);
                                                            else if (null != t.length) {
                                                                var r = V(t, I);
                                                                W(e, r, t.length, -1), er(r);
                                                            } else $(e, "Wrong API use : tried to return a value of an unknown type (" + t + ").", -1);
                                                            break;
                                                        default:
                                                            console.warn("unknown sqlite result type: ", typeof t, t), H(e);
                                                    }
                                                }),
                                                (Z.prototype.create_vtab = function (e) {
                                                    const t = new e(i, this),
                                                        r = {
                                                            iVersion: null,
                                                            xCreate: "ptr",
                                                            xConnect: "ptr",
                                                            xBestIndex: "ptr",
                                                            xDisconnect: "ptr",
                                                            xDestroy: "ptr",
                                                            xOpen: "ptr",
                                                            xClose: "ptr",
                                                            xFilter: "ptr",
                                                            xNext: "ptr",
                                                            xEof: "ptr",
                                                            xColumn: "ptr",
                                                            xRowid: "ptr",
                                                            xUpdate: "ptr",
                                                            xBegin: "ptr",
                                                            xSync: "ptr",
                                                            xCommit: "ptr",
                                                            xRollback: "ptr",
                                                            xFindFunction: "ptr",
                                                            xRename: "ptr",
                                                            xSavepoint: "ptr",
                                                            xRelease: "ptr",
                                                            xRollbackTo: "ptr",
                                                            xShadowName: "ptr",
                                                        },
                                                        n = Zt(4 * Object.keys(r).length);
                                                    let o = 0;
                                                    for (const e in r) {
                                                        let i = t[e] || 0,
                                                            s = "i32";
                                                        if (r[e] && t[e]) {
                                                            const r = t[e].bind(t);
                                                            (i = O(
                                                                r,
                                                                Array(1 + r.length)
                                                                    .fill("i")
                                                                    .join("")
                                                            )),
                                                                (s = "*");
                                                        }
                                                        j(n + 4 * o, i, s), o++;
                                                    }
                                                    this.handleError(M(this.db, t.name, n, 0, 0));
                                                }),
                                                (i.Database = Z),
                                                (i.CustomDatabase = te),
                                                (i.FS = et),
                                                (te.prototype = Object.create(Z.prototype));
                                        });
                                    var a,
                                        u = {};
                                    for (a in i) i.hasOwnProperty(a) && (u[a] = i[a]);
                                    var l = [],
                                        c = "./this.program",
                                        f = !1,
                                        d = !1,
                                        h = !1,
                                        p = !1;
                                    (f = "object" == typeof window),
                                        (d = "function" == typeof importScripts),
                                        (h = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node),
                                        (p = !f && !h && !d);
                                    var m,
                                        _,
                                        g,
                                        v,
                                        y,
                                        b = "";
                                    function w(e) {
                                        return i.locateFile ? i.locateFile(e, b) : b + e;
                                    }
                                    h
                                        ? ((b = d ? r(101).dirname(b) + "/" : "//"),
                                            (m = function (e, t) {
                                                return v || (v = r(905)), y || (y = r(101)), (e = y.normalize(e)), v.readFileSync(e, t ? null : "utf8");
                                            }),
                                            (g = function (e) {
                                                var t = m(e, !0);
                                                return t.buffer || (t = new Uint8Array(t)), B(t.buffer), t;
                                            }),
                                        process.argv.length > 1 && (c = process.argv[1].replace(/\\/g, "/")),
                                            (l = process.argv.slice(2)),
                                            (e.exports = i),
                                            (i.inspect = function () {
                                                return "[Emscripten Module object]";
                                            }))
                                        : p
                                        ? ("undefined" != typeof read &&
                                        (m = function (e) {
                                            return read(e);
                                        }),
                                            (g = function (e) {
                                                var t;
                                                return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (B("object" == typeof (t = read(e, "binary"))), t);
                                            }),
                                            "undefined" != typeof scriptArgs ? (l = scriptArgs) : void 0 !== arguments && (l = arguments),
                                        "undefined" != typeof print && ("undefined" == typeof console && (console = {}), (console.log = print), (console.warn = console.error = "undefined" != typeof printErr ? printErr : print)))
                                        : (f || d) &&
                                        (d ? (b = self.location.href) : "undefined" != typeof document && document.currentScript && (b = document.currentScript.src),
                                            (b = 0 !== b.indexOf("blob:") ? b.substr(0, b.lastIndexOf("/") + 1) : ""),
                                            (m = function (e) {
                                                var t = new XMLHttpRequest();
                                                return t.open("GET", e, !1), t.send(null), t.responseText;
                                            }),
                                        d &&
                                        (g = function (e) {
                                            var t = new XMLHttpRequest();
                                            return t.open("GET", e, !1), (t.responseType = "arraybuffer"), t.send(null), new Uint8Array(t.response);
                                        }),
                                            (_ = function (e, t, r) {
                                                var n = new XMLHttpRequest();
                                                n.open("GET", e, !0),
                                                    (n.responseType = "arraybuffer"),
                                                    (n.onload = function () {
                                                        200 == n.status || (0 == n.status && n.response) ? t(n.response) : r();
                                                    }),
                                                    (n.onerror = r),
                                                    n.send(null);
                                            }));
                                    var E = i.print || console.log.bind(console),
                                        k = i.printErr || console.warn.bind(console);
                                    for (a in u) u.hasOwnProperty(a) && (i[a] = u[a]);
                                    (u = null), i.arguments && (l = i.arguments), i.thisProgram && (c = i.thisProgram), i.quit && i.quit;
                                    var S = 16;
                                    function q(e, t) {
                                        return t || (t = S), Math.ceil(e / t) * t;
                                    }
                                    function x(e, t) {
                                        if ("function" == typeof WebAssembly.Function) {
                                            for (var r = { i: "i32", j: "i64", f: "f32", d: "f64" }, n = { parameters: [], results: "v" == t[0] ? [] : [r[t[0]]] }, o = 1; o < t.length; ++o) n.parameters.push(r[t[o]]);
                                            return new WebAssembly.Function(n, e);
                                        }
                                        var i = [1, 0, 1, 96],
                                            s = t.slice(0, 1),
                                            a = t.slice(1),
                                            u = { i: 127, j: 126, f: 125, d: 124 };
                                        for (i.push(a.length), o = 0; o < a.length; ++o) i.push(u[a[o]]);
                                        "v" == s ? i.push(0) : (i = i.concat([1, u[s]])), (i[1] = i.length - 2);
                                        var l = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(i, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])),
                                            c = new WebAssembly.Module(l);
                                        return new WebAssembly.Instance(c, { e: { f: e } }).exports.f;
                                    }
                                    var D,
                                        F,
                                        M,
                                        P = [];
                                    function A() {
                                        if (P.length) return P.pop();
                                        try {
                                            ce.grow(1);
                                        } catch (e) {
                                            if (!(e instanceof RangeError)) throw e;
                                            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                                        }
                                        return ce.length - 1;
                                    }
                                    function R(e, t) {
                                        if (!D) {
                                            D = new WeakMap();
                                            for (var r = 0; r < ce.length; r++) {
                                                var n = ce.get(r);
                                                n && D.set(n, r);
                                            }
                                        }
                                        if (D.has(e)) return D.get(e);
                                        var o = A();
                                        try {
                                            ce.set(o, e);
                                        } catch (r) {
                                            if (!(r instanceof TypeError)) throw r;
                                            var i = x(e, t);
                                            ce.set(o, i);
                                        }
                                        return D.set(e, o), o;
                                    }
                                    function z(e) {
                                        D.delete(ce.get(e)), P.push(e);
                                    }
                                    function O(e, t) {
                                        return R(e, t);
                                    }
                                    function j(e, t, r, n) {
                                        switch (("*" === (r = r || "i8").charAt(r.length - 1) && (r = "i32"), r)) {
                                            case "i1":
                                            case "i8":
                                                X[e >> 0] = t;
                                                break;
                                            case "i16":
                                                $[e >> 1] = t;
                                                break;
                                            case "i32":
                                                K[e >> 2] = t;
                                                break;
                                            case "i64":
                                                (Oe = [t >>> 0, ((ze = t), +Math.abs(ze) >= 1 ? (ze > 0 ? (0 | Math.min(+Math.floor(ze / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ze - +(~~ze >>> 0)) / 4294967296) >>> 0) : 0)]),
                                                    (K[e >> 2] = Oe[0]),
                                                    (K[(e + 4) >> 2] = Oe[1]);
                                                break;
                                            case "float":
                                                Y[e >> 2] = t;
                                                break;
                                            case "double":
                                                Q[e >> 3] = t;
                                                break;
                                            default:
                                                De("invalid type for setValue: " + r);
                                        }
                                    }
                                    function C(e, t, r) {
                                        switch (("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t)) {
                                            case "i1":
                                            case "i8":
                                                return X[e >> 0];
                                            case "i16":
                                                return $[e >> 1];
                                            case "i32":
                                            case "i64":
                                                return K[e >> 2];
                                            case "float":
                                                return Y[e >> 2];
                                            case "double":
                                                return Q[e >> 3];
                                            default:
                                                De("invalid type for getValue: " + t);
                                        }
                                        return null;
                                    }
                                    i.wasmBinary && (F = i.wasmBinary), i.noExitRuntime, "object" != typeof WebAssembly && De("no native wasm support detected");
                                    var T = !1;
                                    function B(e, t) {
                                        e || De("Assertion failed: " + t);
                                    }
                                    function L(e) {
                                        var t = i["_" + e];
                                        return B(t, "Cannot call unknown function " + e + ", make sure it is exported"), t;
                                    }
                                    function N(e, t, r, n, o) {
                                        var i = {
                                                string: function (e) {
                                                    var t = 0;
                                                    if (null != e && 0 !== e) {
                                                        var r = 1 + (e.length << 2);
                                                        re(e, (t = sr(r)), r);
                                                    }
                                                    return t;
                                                },
                                                array: function (e) {
                                                    var t = sr(e.length);
                                                    return se(e, t), t;
                                                },
                                            },
                                            s = L(e),
                                            a = [],
                                            u = 0;
                                        if (n)
                                            for (var l = 0; l < n.length; l++) {
                                                var c = i[r[l]];
                                                c ? (0 === u && (u = or()), (a[l] = c(n[l]))) : (a[l] = n[l]);
                                            }
                                        var f = s.apply(null, a);
                                        return (
                                            (f = (function (e) {
                                                return "string" === t ? ee(e) : "boolean" === t ? Boolean(e) : e;
                                            })(f)),
                                            0 !== u && ir(u),
                                                f
                                        );
                                    }
                                    function H(e, t, r, n) {
                                        var o = (r = r || []).every(function (e) {
                                            return "number" === e;
                                        });
                                        return "string" !== t && o && !n
                                            ? L(e)
                                            : function () {
                                                return N(e, t, r, arguments);
                                            };
                                    }
                                    var I = 0,
                                        U = 1;
                                    function V(e, t) {
                                        var r;
                                        return (r = t == U ? sr(e.length) : Zt(e.length)), e.subarray || e.slice ? G.set(e, r) : G.set(new Uint8Array(e), r), r;
                                    }
                                    var W,
                                        X,
                                        G,
                                        $,
                                        K,
                                        Y,
                                        Q,
                                        J = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
                                    function Z(e, t, r) {
                                        for (var n = t + r, o = t; e[o] && !(o >= n); ) ++o;
                                        if (o - t > 16 && e.subarray && J) return J.decode(e.subarray(t, o));
                                        for (var i = ""; t < o; ) {
                                            var s = e[t++];
                                            if (128 & s) {
                                                var a = 63 & e[t++];
                                                if (192 != (224 & s)) {
                                                    var u = 63 & e[t++];
                                                    if ((s = 224 == (240 & s) ? ((15 & s) << 12) | (a << 6) | u : ((7 & s) << 18) | (a << 12) | (u << 6) | (63 & e[t++])) < 65536) i += String.fromCharCode(s);
                                                    else {
                                                        var l = s - 65536;
                                                        i += String.fromCharCode(55296 | (l >> 10), 56320 | (1023 & l));
                                                    }
                                                } else i += String.fromCharCode(((31 & s) << 6) | a);
                                            } else i += String.fromCharCode(s);
                                        }
                                        return i;
                                    }
                                    function ee(e, t) {
                                        return e ? Z(G, e, t) : "";
                                    }
                                    function te(e, t, r, n) {
                                        if (!(n > 0)) return 0;
                                        for (var o = r, i = r + n - 1, s = 0; s < e.length; ++s) {
                                            var a = e.charCodeAt(s);
                                            if ((a >= 55296 && a <= 57343 && (a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++s))), a <= 127)) {
                                                if (r >= i) break;
                                                t[r++] = a;
                                            } else if (a <= 2047) {
                                                if (r + 1 >= i) break;
                                                (t[r++] = 192 | (a >> 6)), (t[r++] = 128 | (63 & a));
                                            } else if (a <= 65535) {
                                                if (r + 2 >= i) break;
                                                (t[r++] = 224 | (a >> 12)), (t[r++] = 128 | ((a >> 6) & 63)), (t[r++] = 128 | (63 & a));
                                            } else {
                                                if (r + 3 >= i) break;
                                                (t[r++] = 240 | (a >> 18)), (t[r++] = 128 | ((a >> 12) & 63)), (t[r++] = 128 | ((a >> 6) & 63)), (t[r++] = 128 | (63 & a));
                                            }
                                        }
                                        return (t[r] = 0), r - o;
                                    }
                                    function re(e, t, r) {
                                        return te(e, G, t, r);
                                    }
                                    function ne(e) {
                                        for (var t = 0, r = 0; r < e.length; ++r) {
                                            var n = e.charCodeAt(r);
                                            n >= 55296 && n <= 57343 && (n = (65536 + ((1023 & n) << 10)) | (1023 & e.charCodeAt(++r))), n <= 127 ? ++t : (t += n <= 2047 ? 2 : n <= 65535 ? 3 : 4);
                                        }
                                        return t;
                                    }
                                    function oe(e) {
                                        var t = ne(e) + 1,
                                            r = Zt(t);
                                        return r && te(e, X, r, t), r;
                                    }
                                    function ie(e) {
                                        var t = ne(e) + 1,
                                            r = sr(t);
                                        return te(e, X, r, t), r;
                                    }
                                    function se(e, t) {
                                        X.set(e, t);
                                    }
                                    function ae(e, t, r) {
                                        for (var n = 0; n < e.length; ++n) X[t++ >> 0] = e.charCodeAt(n);
                                        r || (X[t >> 0] = 0);
                                    }
                                    function ue(e, t) {
                                        return e % t > 0 && (e += t - (e % t)), e;
                                    }
                                    function le(e) {
                                        (W = e),
                                            (i.HEAP8 = X = new Int8Array(e)),
                                            (i.HEAP16 = $ = new Int16Array(e)),
                                            (i.HEAP32 = K = new Int32Array(e)),
                                            (i.HEAPU8 = G = new Uint8Array(e)),
                                            (i.HEAPU16 = new Uint16Array(e)),
                                            (i.HEAPU32 = new Uint32Array(e)),
                                            (i.HEAPF32 = Y = new Float32Array(e)),
                                            (i.HEAPF64 = Q = new Float64Array(e));
                                    }
                                    i.INITIAL_MEMORY;
                                    var ce,
                                        fe = [],
                                        de = [],
                                        he = [],
                                        pe = [];
                                    function me() {
                                        if (i.preRun) for ("function" == typeof i.preRun && (i.preRun = [i.preRun]); i.preRun.length; ) ye(i.preRun.shift());
                                        Le(fe);
                                    }
                                    function _e() {
                                        i.noFSInit || et.init.initialized || et.init(), Ye.init(), Le(de);
                                    }
                                    function ge() {
                                        (et.ignorePermissions = !1), Le(he);
                                    }
                                    function ve() {
                                        if (i.postRun) for ("function" == typeof i.postRun && (i.postRun = [i.postRun]); i.postRun.length; ) we(i.postRun.shift());
                                        Le(pe);
                                    }
                                    function ye(e) {
                                        fe.unshift(e);
                                    }
                                    function be(e) {
                                        de.unshift(e);
                                    }
                                    function we(e) {
                                        pe.unshift(e);
                                    }
                                    var Ee = 0,
                                        ke = null,
                                        Se = null;
                                    function qe(e) {
                                        Ee++, i.monitorRunDependencies && i.monitorRunDependencies(Ee);
                                    }
                                    function xe(e) {
                                        if ((Ee--, i.monitorRunDependencies && i.monitorRunDependencies(Ee), 0 == Ee && (null !== ke && (clearInterval(ke), (ke = null)), Se))) {
                                            var t = Se;
                                            (Se = null), t();
                                        }
                                    }
                                    function De(e) {
                                        throw (i.onAbort && i.onAbort(e), k((e += "")), (T = !0), (e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info."), new WebAssembly.RuntimeError(e));
                                    }
                                    function Fe(e, t) {
                                        return String.prototype.startsWith ? e.startsWith(t) : 0 === e.indexOf(t);
                                    }
                                    (i.preloadedImages = {}), (i.preloadedAudios = {});
                                    var Me = "data:application/octet-stream;base64,";
                                    function Pe(e) {
                                        return Fe(e, Me);
                                    }
                                    var Ae = "file://";
                                    function Re(e) {
                                        return Fe(e, Ae);
                                    }
                                    var ze,
                                        Oe,
                                        je = "sql-wasm.wasm";
                                    function Ce(e) {
                                        try {
                                            if (e == je && F) return new Uint8Array(F);
                                            if (g) return g(e);
                                            throw "both async and sync fetching of the wasm failed";
                                        } catch (e) {
                                            De(e);
                                        }
                                    }
                                    function Te() {
                                        if (!F && (f || d)) {
                                            if ("function" == typeof fetch && !Re(je))
                                                return fetch(je, { credentials: "same-origin" })
                                                    .then(function (e) {
                                                        if (!e.ok) throw "failed to load wasm binary file at '" + je + "'";
                                                        return e.arrayBuffer();
                                                    })
                                                    .catch(function () {
                                                        return Ce(je);
                                                    });
                                            if (_)
                                                return new Promise(function (e, t) {
                                                    _(
                                                        je,
                                                        function (t) {
                                                            e(new Uint8Array(t));
                                                        },
                                                        t
                                                    );
                                                });
                                        }
                                        return Promise.resolve().then(function () {
                                            return Ce(je);
                                        });
                                    }
                                    function Be() {
                                        var e = { a: Yt };
                                        function t(e, t) {
                                            var r = e.exports;
                                            (i.asm = r), le((M = i.asm.L).buffer), (ce = i.asm.Ga), be(i.asm.M), xe();
                                        }
                                        function r(e) {
                                            t(e.instance);
                                        }
                                        function n(t) {
                                            return Te()
                                                .then(function (t) {
                                                    return WebAssembly.instantiate(t, e);
                                                })
                                                .then(t, function (e) {
                                                    k("failed to asynchronously prepare wasm: " + e), De(e);
                                                });
                                        }
                                        if ((qe(), i.instantiateWasm))
                                            try {
                                                return i.instantiateWasm(e, t);
                                            } catch (e) {
                                                return k("Module.instantiateWasm callback failed with error: " + e), !1;
                                            }
                                        return (
                                            F || "function" != typeof WebAssembly.instantiateStreaming || Pe(je) || Re(je) || "function" != typeof fetch
                                                ? n(r)
                                                : fetch(je, { credentials: "same-origin" }).then(function (t) {
                                                    return WebAssembly.instantiateStreaming(t, e).then(r, function (e) {
                                                        return k("wasm streaming compile failed: " + e), k("falling back to ArrayBuffer instantiation"), n(r);
                                                    });
                                                }),
                                                {}
                                        );
                                    }
                                    function Le(e) {
                                        for (; e.length > 0; ) {
                                            var t = e.shift();
                                            if ("function" != typeof t) {
                                                var r = t.func;
                                                "number" == typeof r ? (void 0 === t.arg ? ce.get(r)() : ce.get(r)(t.arg)) : r(void 0 === t.arg ? null : t.arg);
                                            } else t(i);
                                        }
                                    }
                                    function Ne(e) {
                                        return e.replace(/\b_Z[\w\d_]+/g, function (e) {
                                            return e == e ? e : e + " [" + e + "]";
                                        });
                                    }
                                    function He() {
                                        var e = new Error();
                                        if (!e.stack) {
                                            try {
                                                throw new Error();
                                            } catch (t) {
                                                e = t;
                                            }
                                            if (!e.stack) return "(no stack trace available)";
                                        }
                                        return e.stack.toString();
                                    }
                                    function Ie() {
                                        var e = He();
                                        return i.extraStackTrace && (e += "\n" + i.extraStackTrace()), Ne(e);
                                    }
                                    function Ue(e, t, r, n) {
                                        De("Assertion failed: " + ee(e) + ", at: " + [t ? ee(t) : "unknown filename", r, n ? ee(n) : "unknown function"]);
                                    }
                                    function Ve() {
                                        if (!Ve.called) {
                                            Ve.called = !0;
                                            var e = new Date().getFullYear(),
                                                t = new Date(e, 0, 1),
                                                r = new Date(e, 6, 1),
                                                n = t.getTimezoneOffset(),
                                                o = r.getTimezoneOffset(),
                                                i = Math.max(n, o);
                                            (K[nr() >> 2] = 60 * i), (K[rr() >> 2] = Number(n != o));
                                            var s = c(t),
                                                a = c(r),
                                                u = oe(s),
                                                l = oe(a);
                                            o < n ? ((K[tr() >> 2] = u), (K[(tr() + 4) >> 2] = l)) : ((K[tr() >> 2] = l), (K[(tr() + 4) >> 2] = u));
                                        }
                                        function c(e) {
                                            var t = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
                                            return t ? t[1] : "GMT";
                                        }
                                    }
                                    function We(e, t) {
                                        Ve();
                                        var r = new Date(1e3 * K[e >> 2]);
                                        (K[t >> 2] = r.getSeconds()),
                                            (K[(t + 4) >> 2] = r.getMinutes()),
                                            (K[(t + 8) >> 2] = r.getHours()),
                                            (K[(t + 12) >> 2] = r.getDate()),
                                            (K[(t + 16) >> 2] = r.getMonth()),
                                            (K[(t + 20) >> 2] = r.getFullYear() - 1900),
                                            (K[(t + 24) >> 2] = r.getDay());
                                        var n = new Date(r.getFullYear(), 0, 1),
                                            o = ((r.getTime() - n.getTime()) / 864e5) | 0;
                                        (K[(t + 28) >> 2] = o), (K[(t + 36) >> 2] = -60 * r.getTimezoneOffset());
                                        var i = new Date(r.getFullYear(), 6, 1).getTimezoneOffset(),
                                            s = n.getTimezoneOffset(),
                                            a = 0 | (i != s && r.getTimezoneOffset() == Math.min(s, i));
                                        K[(t + 32) >> 2] = a;
                                        var u = K[(tr() + (a ? 4 : 0)) >> 2];
                                        return (K[(t + 40) >> 2] = u), t;
                                    }
                                    function Xe(e, t) {
                                        return We(e, t);
                                    }
                                    Pe(je) || (je = w(je));
                                    var Ge = {
                                        splitPath: function (e) {
                                            return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1);
                                        },
                                        normalizeArray: function (e, t) {
                                            for (var r = 0, n = e.length - 1; n >= 0; n--) {
                                                var o = e[n];
                                                "." === o ? e.splice(n, 1) : ".." === o ? (e.splice(n, 1), r++) : r && (e.splice(n, 1), r--);
                                            }
                                            if (t) for (; r; r--) e.unshift("..");
                                            return e;
                                        },
                                        normalize: function (e) {
                                            var t = "/" === e.charAt(0),
                                                r = "/" === e.substr(-1);
                                            return (
                                                (e = Ge.normalizeArray(
                                                    e.split("/").filter(function (e) {
                                                        return !!e;
                                                    }),
                                                    !t
                                                ).join("/")) ||
                                                t ||
                                                (e = "."),
                                                e && r && (e += "/"),
                                                (t ? "/" : "") + e
                                            );
                                        },
                                        dirname: function (e) {
                                            var t = Ge.splitPath(e),
                                                r = t[0],
                                                n = t[1];
                                            return r || n ? (n && (n = n.substr(0, n.length - 1)), r + n) : ".";
                                        },
                                        basename: function (e) {
                                            if ("/" === e) return "/";
                                            var t = (e = (e = Ge.normalize(e)).replace(/\/$/, "")).lastIndexOf("/");
                                            return -1 === t ? e : e.substr(t + 1);
                                        },
                                        extname: function (e) {
                                            return Ge.splitPath(e)[3];
                                        },
                                        join: function () {
                                            var e = Array.prototype.slice.call(arguments, 0);
                                            return Ge.normalize(e.join("/"));
                                        },
                                        join2: function (e, t) {
                                            return Ge.normalize(e + "/" + t);
                                        },
                                    };
                                    function $e() {
                                        if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
                                            var e = new Uint8Array(1);
                                            return function () {
                                                return crypto.getRandomValues(e), e[0];
                                            };
                                        }
                                        if (h)
                                            try {
                                                var t = r(821);
                                                return function () {
                                                    return t.randomBytes(1)[0];
                                                };
                                            } catch (e) {}
                                        return function () {
                                            De("randomDevice");
                                        };
                                    }
                                    var Ke = {
                                            resolve: function () {
                                                for (var e = "", t = !1, r = arguments.length - 1; r >= -1 && !t; r--) {
                                                    var n = r >= 0 ? arguments[r] : et.cwd();
                                                    if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
                                                    if (!n) return "";
                                                    (e = n + "/" + e), (t = "/" === n.charAt(0));
                                                }
                                                return (
                                                    (t ? "/" : "") +
                                                    (e = Ge.normalizeArray(
                                                        e.split("/").filter(function (e) {
                                                            return !!e;
                                                        }),
                                                        !t
                                                    ).join("/")) || "."
                                                );
                                            },
                                            relative: function (e, t) {
                                                function r(e) {
                                                    for (var t = 0; t < e.length && "" === e[t]; t++);
                                                    for (var r = e.length - 1; r >= 0 && "" === e[r]; r--);
                                                    return t > r ? [] : e.slice(t, r - t + 1);
                                                }
                                                (e = Ke.resolve(e).substr(1)), (t = Ke.resolve(t).substr(1));
                                                for (var n = r(e.split("/")), o = r(t.split("/")), i = Math.min(n.length, o.length), s = i, a = 0; a < i; a++)
                                                    if (n[a] !== o[a]) {
                                                        s = a;
                                                        break;
                                                    }
                                                var u = [];
                                                for (a = s; a < n.length; a++) u.push("..");
                                                return (u = u.concat(o.slice(s))).join("/");
                                            },
                                        },
                                        Ye = {
                                            ttys: [],
                                            init: function () {},
                                            shutdown: function () {},
                                            register: function (e, t) {
                                                (Ye.ttys[e] = { input: [], output: [], ops: t }), et.registerDevice(e, Ye.stream_ops);
                                            },
                                            stream_ops: {
                                                open: function (e) {
                                                    var t = Ye.ttys[e.node.rdev];
                                                    if (!t) throw new et.ErrnoError(43);
                                                    (e.tty = t), (e.seekable = !1);
                                                },
                                                close: function (e) {
                                                    e.tty.ops.flush(e.tty);
                                                },
                                                flush: function (e) {
                                                    e.tty.ops.flush(e.tty);
                                                },
                                                read: function (e, t, r, n, o) {
                                                    if (!e.tty || !e.tty.ops.get_char) throw new et.ErrnoError(60);
                                                    for (var i = 0, s = 0; s < n; s++) {
                                                        var a;
                                                        try {
                                                            a = e.tty.ops.get_char(e.tty);
                                                        } catch (e) {
                                                            throw new et.ErrnoError(29);
                                                        }
                                                        if (void 0 === a && 0 === i) throw new et.ErrnoError(6);
                                                        if (null == a) break;
                                                        i++, (t[r + s] = a);
                                                    }
                                                    return i && (e.node.timestamp = Date.now()), i;
                                                },
                                                write: function (e, t, r, n, o) {
                                                    if (!e.tty || !e.tty.ops.put_char) throw new et.ErrnoError(60);
                                                    try {
                                                        for (var i = 0; i < n; i++) e.tty.ops.put_char(e.tty, t[r + i]);
                                                    } catch (e) {
                                                        throw new et.ErrnoError(29);
                                                    }
                                                    return n && (e.node.timestamp = Date.now()), i;
                                                },
                                            },
                                            default_tty_ops: {
                                                get_char: function (e) {
                                                    if (!e.input.length) {
                                                        var t = null;
                                                        if (h) {
                                                            var r = Buffer.alloc ? Buffer.alloc(256) : new Buffer(256),
                                                                n = 0;
                                                            try {
                                                                n = v.readSync(process.stdin.fd, r, 0, 256, null);
                                                            } catch (e) {
                                                                if (-1 == e.toString().indexOf("EOF")) throw e;
                                                                n = 0;
                                                            }
                                                            t = n > 0 ? r.slice(0, n).toString("utf-8") : null;
                                                        } else
                                                            "undefined" != typeof window && "function" == typeof window.prompt
                                                                ? null !== (t = window.prompt("Input: ")) && (t += "\n")
                                                                : "function" == typeof readline && null !== (t = readline()) && (t += "\n");
                                                        if (!t) return null;
                                                        e.input = $t(t, !0);
                                                    }
                                                    return e.input.shift();
                                                },
                                                put_char: function (e, t) {
                                                    null === t || 10 === t ? (E(Z(e.output, 0)), (e.output = [])) : 0 != t && e.output.push(t);
                                                },
                                                flush: function (e) {
                                                    e.output && e.output.length > 0 && (E(Z(e.output, 0)), (e.output = []));
                                                },
                                            },
                                            default_tty1_ops: {
                                                put_char: function (e, t) {
                                                    null === t || 10 === t ? (k(Z(e.output, 0)), (e.output = [])) : 0 != t && e.output.push(t);
                                                },
                                                flush: function (e) {
                                                    e.output && e.output.length > 0 && (k(Z(e.output, 0)), (e.output = []));
                                                },
                                            },
                                        };
                                    function Qe(e) {
                                        for (var t = q(e, 16384), r = Zt(t); e < t; ) X[r + e++] = 0;
                                        return r;
                                    }
                                    var Je,
                                        Ze = {
                                            ops_table: null,
                                            mount: function (e) {
                                                return Ze.createNode(null, "/", 16895, 0);
                                            },
                                            createNode: function (e, t, r, n) {
                                                if (et.isBlkdev(r) || et.isFIFO(r)) throw new et.ErrnoError(63);
                                                Ze.ops_table ||
                                                (Ze.ops_table = {
                                                    dir: {
                                                        node: {
                                                            getattr: Ze.node_ops.getattr,
                                                            setattr: Ze.node_ops.setattr,
                                                            lookup: Ze.node_ops.lookup,
                                                            mknod: Ze.node_ops.mknod,
                                                            rename: Ze.node_ops.rename,
                                                            unlink: Ze.node_ops.unlink,
                                                            rmdir: Ze.node_ops.rmdir,
                                                            readdir: Ze.node_ops.readdir,
                                                            symlink: Ze.node_ops.symlink,
                                                        },
                                                        stream: { llseek: Ze.stream_ops.llseek },
                                                    },
                                                    file: {
                                                        node: { getattr: Ze.node_ops.getattr, setattr: Ze.node_ops.setattr },
                                                        stream: {
                                                            llseek: Ze.stream_ops.llseek,
                                                            read: Ze.stream_ops.read,
                                                            write: Ze.stream_ops.write,
                                                            allocate: Ze.stream_ops.allocate,
                                                            mmap: Ze.stream_ops.mmap,
                                                            msync: Ze.stream_ops.msync,
                                                        },
                                                    },
                                                    link: { node: { getattr: Ze.node_ops.getattr, setattr: Ze.node_ops.setattr, readlink: Ze.node_ops.readlink }, stream: {} },
                                                    chrdev: { node: { getattr: Ze.node_ops.getattr, setattr: Ze.node_ops.setattr }, stream: et.chrdev_stream_ops },
                                                });
                                                var o = et.createNode(e, t, r, n);
                                                return (
                                                    et.isDir(o.mode)
                                                        ? ((o.node_ops = Ze.ops_table.dir.node), (o.stream_ops = Ze.ops_table.dir.stream), (o.contents = {}))
                                                        : et.isFile(o.mode)
                                                        ? ((o.node_ops = Ze.ops_table.file.node), (o.stream_ops = Ze.ops_table.file.stream), (o.usedBytes = 0), (o.contents = null))
                                                        : et.isLink(o.mode)
                                                            ? ((o.node_ops = Ze.ops_table.link.node), (o.stream_ops = Ze.ops_table.link.stream))
                                                            : et.isChrdev(o.mode) && ((o.node_ops = Ze.ops_table.chrdev.node), (o.stream_ops = Ze.ops_table.chrdev.stream)),
                                                        (o.timestamp = Date.now()),
                                                    e && ((e.contents[t] = o), (e.timestamp = o.timestamp)),
                                                        o
                                                );
                                            },
                                            getFileDataAsTypedArray: function (e) {
                                                return e.contents ? (e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents)) : new Uint8Array(0);
                                            },
                                            expandFileStorage: function (e, t) {
                                                var r = e.contents ? e.contents.length : 0;
                                                if (!(r >= t)) {
                                                    (t = Math.max(t, (r * (r < 1048576 ? 2 : 1.125)) >>> 0)), 0 != r && (t = Math.max(t, 256));
                                                    var n = e.contents;
                                                    (e.contents = new Uint8Array(t)), e.usedBytes > 0 && e.contents.set(n.subarray(0, e.usedBytes), 0);
                                                }
                                            },
                                            resizeFileStorage: function (e, t) {
                                                if (e.usedBytes != t)
                                                    if (0 == t) (e.contents = null), (e.usedBytes = 0);
                                                    else {
                                                        var r = e.contents;
                                                        (e.contents = new Uint8Array(t)), r && e.contents.set(r.subarray(0, Math.min(t, e.usedBytes))), (e.usedBytes = t);
                                                    }
                                            },
                                            node_ops: {
                                                getattr: function (e) {
                                                    var t = {};
                                                    return (
                                                        (t.dev = et.isChrdev(e.mode) ? e.id : 1),
                                                            (t.ino = e.id),
                                                            (t.mode = e.mode),
                                                            (t.nlink = 1),
                                                            (t.uid = 0),
                                                            (t.gid = 0),
                                                            (t.rdev = e.rdev),
                                                            et.isDir(e.mode) ? (t.size = 4096) : et.isFile(e.mode) ? (t.size = e.usedBytes) : et.isLink(e.mode) ? (t.size = e.link.length) : (t.size = 0),
                                                            (t.atime = new Date(e.timestamp)),
                                                            (t.mtime = new Date(e.timestamp)),
                                                            (t.ctime = new Date(e.timestamp)),
                                                            (t.blksize = 4096),
                                                            (t.blocks = Math.ceil(t.size / t.blksize)),
                                                            t
                                                    );
                                                },
                                                setattr: function (e, t) {
                                                    void 0 !== t.mode && (e.mode = t.mode), void 0 !== t.timestamp && (e.timestamp = t.timestamp), void 0 !== t.size && Ze.resizeFileStorage(e, t.size);
                                                },
                                                lookup: function (e, t) {
                                                    throw et.genericErrors[44];
                                                },
                                                mknod: function (e, t, r, n) {
                                                    return Ze.createNode(e, t, r, n);
                                                },
                                                rename: function (e, t, r) {
                                                    if (et.isDir(e.mode)) {
                                                        var n;
                                                        try {
                                                            n = et.lookupNode(t, r);
                                                        } catch (e) {}
                                                        if (n) for (var o in n.contents) throw new et.ErrnoError(55);
                                                    }
                                                    delete e.parent.contents[e.name], (e.parent.timestamp = Date.now()), (e.name = r), (t.contents[r] = e), (t.timestamp = e.parent.timestamp), (e.parent = t);
                                                },
                                                unlink: function (e, t) {
                                                    delete e.contents[t], (e.timestamp = Date.now());
                                                },
                                                rmdir: function (e, t) {
                                                    var r = et.lookupNode(e, t);
                                                    for (var n in r.contents) throw new et.ErrnoError(55);
                                                    delete e.contents[t], (e.timestamp = Date.now());
                                                },
                                                readdir: function (e) {
                                                    var t = [".", ".."];
                                                    for (var r in e.contents) e.contents.hasOwnProperty(r) && t.push(r);
                                                    return t;
                                                },
                                                symlink: function (e, t, r) {
                                                    var n = Ze.createNode(e, t, 41471, 0);
                                                    return (n.link = r), n;
                                                },
                                                readlink: function (e) {
                                                    if (!et.isLink(e.mode)) throw new et.ErrnoError(28);
                                                    return e.link;
                                                },
                                            },
                                            stream_ops: {
                                                read: function (e, t, r, n, o) {
                                                    var i = e.node.contents;
                                                    if (o >= e.node.usedBytes) return 0;
                                                    var s = Math.min(e.node.usedBytes - o, n);
                                                    if (s > 8 && i.subarray) t.set(i.subarray(o, o + s), r);
                                                    else for (var a = 0; a < s; a++) t[r + a] = i[o + a];
                                                    return s;
                                                },
                                                write: function (e, t, r, n, o, i) {
                                                    if ((t.buffer === X.buffer && (i = !1), !n)) return 0;
                                                    var s = e.node;
                                                    if (((s.timestamp = Date.now()), t.subarray && (!s.contents || s.contents.subarray))) {
                                                        if (i) return (s.contents = t.subarray(r, r + n)), (s.usedBytes = n), n;
                                                        if (0 === s.usedBytes && 0 === o) return (s.contents = t.slice(r, r + n)), (s.usedBytes = n), n;
                                                        if (o + n <= s.usedBytes) return s.contents.set(t.subarray(r, r + n), o), n;
                                                    }
                                                    if ((Ze.expandFileStorage(s, o + n), s.contents.subarray && t.subarray)) s.contents.set(t.subarray(r, r + n), o);
                                                    else for (var a = 0; a < n; a++) s.contents[o + a] = t[r + a];
                                                    return (s.usedBytes = Math.max(s.usedBytes, o + n)), n;
                                                },
                                                llseek: function (e, t, r) {
                                                    var n = t;
                                                    if ((1 === r ? (n += e.position) : 2 === r && et.isFile(e.node.mode) && (n += e.node.usedBytes), n < 0)) throw new et.ErrnoError(28);
                                                    return n;
                                                },
                                                allocate: function (e, t, r) {
                                                    Ze.expandFileStorage(e.node, t + r), (e.node.usedBytes = Math.max(e.node.usedBytes, t + r));
                                                },
                                                mmap: function (e, t, r, n, o, i) {
                                                    if (0 !== t) throw new et.ErrnoError(28);
                                                    if (!et.isFile(e.node.mode)) throw new et.ErrnoError(43);
                                                    var s,
                                                        a,
                                                        u = e.node.contents;
                                                    if (2 & i || u.buffer !== W) {
                                                        if (((n > 0 || n + r < u.length) && (u = u.subarray ? u.subarray(n, n + r) : Array.prototype.slice.call(u, n, n + r)), (a = !0), !(s = Qe(r)))) throw new et.ErrnoError(48);
                                                        X.set(u, s);
                                                    } else (a = !1), (s = u.byteOffset);
                                                    return { ptr: s, allocated: a };
                                                },
                                                msync: function (e, t, r, n, o) {
                                                    if (!et.isFile(e.node.mode)) throw new et.ErrnoError(43);
                                                    return 2 & o || Ze.stream_ops.write(e, t, 0, n, r, !1), 0;
                                                },
                                            },
                                        },
                                        et = {
                                            root: null,
                                            mounts: [],
                                            devices: {},
                                            streams: [],
                                            nextInode: 1,
                                            nameTable: null,
                                            currentPath: "/",
                                            initialized: !1,
                                            ignorePermissions: !0,
                                            trackingDelegate: {},
                                            tracking: { openFlags: { READ: 1, WRITE: 2 } },
                                            ErrnoError: null,
                                            genericErrors: {},
                                            filesystems: null,
                                            syncFSRequests: 0,
                                            lookupPath: function (e, t) {
                                                if (((t = t || {}), !(e = Ke.resolve(et.cwd(), e)))) return { path: "", node: null };
                                                var r = { follow_mount: !0, recurse_count: 0 };
                                                for (var n in r) void 0 === t[n] && (t[n] = r[n]);
                                                if (t.recurse_count > 8) throw new et.ErrnoError(32);
                                                for (
                                                    var o = Ge.normalizeArray(
                                                        e.split("/").filter(function (e) {
                                                            return !!e;
                                                        }),
                                                        !1
                                                        ),
                                                        i = et.root,
                                                        s = "/",
                                                        a = 0;
                                                    a < o.length;
                                                    a++
                                                ) {
                                                    var u = a === o.length - 1;
                                                    if (u && t.parent) break;
                                                    if (((i = et.lookupNode(i, o[a])), (s = Ge.join2(s, o[a])), et.isMountpoint(i) && (!u || (u && t.follow_mount)) && (i = i.mounted.root), !u || t.follow))
                                                        for (var l = 0; et.isLink(i.mode); ) {
                                                            var c = et.readlink(s);
                                                            if (((s = Ke.resolve(Ge.dirname(s), c)), (i = et.lookupPath(s, { recurse_count: t.recurse_count }).node), l++ > 40)) throw new et.ErrnoError(32);
                                                        }
                                                }
                                                return { path: s, node: i };
                                            },
                                            getPath: function (e) {
                                                for (var t; ; ) {
                                                    if (et.isRoot(e)) {
                                                        var r = e.mount.mountpoint;
                                                        return t ? ("/" !== r[r.length - 1] ? r + "/" + t : r + t) : r;
                                                    }
                                                    (t = t ? e.name + "/" + t : e.name), (e = e.parent);
                                                }
                                            },
                                            hashName: function (e, t) {
                                                for (var r = 0, n = 0; n < t.length; n++) r = ((r << 5) - r + t.charCodeAt(n)) | 0;
                                                return ((e + r) >>> 0) % et.nameTable.length;
                                            },
                                            hashAddNode: function (e) {
                                                var t = et.hashName(e.parent.id, e.name);
                                                (e.name_next = et.nameTable[t]), (et.nameTable[t] = e);
                                            },
                                            hashRemoveNode: function (e) {
                                                var t = et.hashName(e.parent.id, e.name);
                                                if (et.nameTable[t] === e) et.nameTable[t] = e.name_next;
                                                else
                                                    for (var r = et.nameTable[t]; r; ) {
                                                        if (r.name_next === e) {
                                                            r.name_next = e.name_next;
                                                            break;
                                                        }
                                                        r = r.name_next;
                                                    }
                                            },
                                            lookupNode: function (e, t) {
                                                var r = et.mayLookup(e);
                                                if (r) throw new et.ErrnoError(r, e);
                                                for (var n = et.hashName(e.id, t), o = et.nameTable[n]; o; o = o.name_next) {
                                                    var i = o.name;
                                                    if (o.parent.id === e.id && i === t) return o;
                                                }
                                                return et.lookup(e, t);
                                            },
                                            createNode: function (e, t, r, n) {
                                                var o = new et.FSNode(e, t, r, n);
                                                return et.hashAddNode(o), o;
                                            },
                                            destroyNode: function (e) {
                                                et.hashRemoveNode(e);
                                            },
                                            isRoot: function (e) {
                                                return e === e.parent;
                                            },
                                            isMountpoint: function (e) {
                                                return !!e.mounted;
                                            },
                                            isFile: function (e) {
                                                return 32768 == (61440 & e);
                                            },
                                            isDir: function (e) {
                                                return 16384 == (61440 & e);
                                            },
                                            isLink: function (e) {
                                                return 40960 == (61440 & e);
                                            },
                                            isChrdev: function (e) {
                                                return 8192 == (61440 & e);
                                            },
                                            isBlkdev: function (e) {
                                                return 24576 == (61440 & e);
                                            },
                                            isFIFO: function (e) {
                                                return 4096 == (61440 & e);
                                            },
                                            isSocket: function (e) {
                                                return 49152 == (49152 & e);
                                            },
                                            flagModes: { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 },
                                            modeStringToFlags: function (e) {
                                                var t = et.flagModes[e];
                                                if (void 0 === t) throw new Error("Unknown file open mode: " + e);
                                                return t;
                                            },
                                            flagsToPermissionString: function (e) {
                                                var t = ["r", "w", "rw"][3 & e];
                                                return 512 & e && (t += "w"), t;
                                            },
                                            nodePermissions: function (e, t) {
                                                return et.ignorePermissions || ((-1 === t.indexOf("r") || 292 & e.mode) && (-1 === t.indexOf("w") || 146 & e.mode) && (-1 === t.indexOf("x") || 73 & e.mode)) ? 0 : 2;
                                            },
                                            mayLookup: function (e) {
                                                return et.nodePermissions(e, "x") || (e.node_ops.lookup ? 0 : 2);
                                            },
                                            mayCreate: function (e, t) {
                                                try {
                                                    return et.lookupNode(e, t), 20;
                                                } catch (e) {}
                                                return et.nodePermissions(e, "wx");
                                            },
                                            mayDelete: function (e, t, r) {
                                                var n;
                                                try {
                                                    n = et.lookupNode(e, t);
                                                } catch (e) {
                                                    return e.errno;
                                                }
                                                var o = et.nodePermissions(e, "wx");
                                                if (o) return o;
                                                if (r) {
                                                    if (!et.isDir(n.mode)) return 54;
                                                    if (et.isRoot(n) || et.getPath(n) === et.cwd()) return 10;
                                                } else if (et.isDir(n.mode)) return 31;
                                                return 0;
                                            },
                                            mayOpen: function (e, t) {
                                                return e ? (et.isLink(e.mode) ? 32 : et.isDir(e.mode) && ("r" !== et.flagsToPermissionString(t) || 512 & t) ? 31 : et.nodePermissions(e, et.flagsToPermissionString(t))) : 44;
                                            },
                                            MAX_OPEN_FDS: 4096,
                                            nextfd: function (e, t) {
                                                (e = e || 0), (t = t || et.MAX_OPEN_FDS);
                                                for (var r = e; r <= t; r++) if (!et.streams[r]) return r;
                                                throw new et.ErrnoError(33);
                                            },
                                            getStream: function (e) {
                                                return et.streams[e];
                                            },
                                            createStream: function (e, t, r) {
                                                et.FSStream ||
                                                ((et.FSStream = function () {}),
                                                    (et.FSStream.prototype = {
                                                        object: {
                                                            get: function () {
                                                                return this.node;
                                                            },
                                                            set: function (e) {
                                                                this.node = e;
                                                            },
                                                        },
                                                        isRead: {
                                                            get: function () {
                                                                return 1 != (2097155 & this.flags);
                                                            },
                                                        },
                                                        isWrite: {
                                                            get: function () {
                                                                return 0 != (2097155 & this.flags);
                                                            },
                                                        },
                                                        isAppend: {
                                                            get: function () {
                                                                return 1024 & this.flags;
                                                            },
                                                        },
                                                    }));
                                                var n = new et.FSStream();
                                                for (var o in e) n[o] = e[o];
                                                e = n;
                                                var i = et.nextfd(t, r);
                                                return (e.fd = i), (et.streams[i] = e), e;
                                            },
                                            closeStream: function (e) {
                                                et.streams[e] = null;
                                            },
                                            chrdev_stream_ops: {
                                                open: function (e) {
                                                    var t = et.getDevice(e.node.rdev);
                                                    (e.stream_ops = t.stream_ops), e.stream_ops.open && e.stream_ops.open(e);
                                                },
                                                llseek: function () {
                                                    throw new et.ErrnoError(70);
                                                },
                                            },
                                            major: function (e) {
                                                return e >> 8;
                                            },
                                            minor: function (e) {
                                                return 255 & e;
                                            },
                                            makedev: function (e, t) {
                                                return (e << 8) | t;
                                            },
                                            registerDevice: function (e, t) {
                                                et.devices[e] = { stream_ops: t };
                                            },
                                            getDevice: function (e) {
                                                return et.devices[e];
                                            },
                                            getMounts: function (e) {
                                                for (var t = [], r = [e]; r.length; ) {
                                                    var n = r.pop();
                                                    t.push(n), r.push.apply(r, n.mounts);
                                                }
                                                return t;
                                            },
                                            syncfs: function (e, t) {
                                                "function" == typeof e && ((t = e), (e = !1)),
                                                    et.syncFSRequests++,
                                                et.syncFSRequests > 1 && k("warning: " + et.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
                                                var r = et.getMounts(et.root.mount),
                                                    n = 0;
                                                function o(e) {
                                                    return et.syncFSRequests--, t(e);
                                                }
                                                function i(e) {
                                                    if (e) return i.errored ? void 0 : ((i.errored = !0), o(e));
                                                    ++n >= r.length && o(null);
                                                }
                                                r.forEach(function (t) {
                                                    if (!t.type.syncfs) return i(null);
                                                    t.type.syncfs(t, e, i);
                                                });
                                            },
                                            mount: function (e, t, r) {
                                                var n,
                                                    o = "/" === r,
                                                    i = !r;
                                                if (o && et.root) throw new et.ErrnoError(10);
                                                if (!o && !i) {
                                                    var s = et.lookupPath(r, { follow_mount: !1 });
                                                    if (((r = s.path), (n = s.node), et.isMountpoint(n))) throw new et.ErrnoError(10);
                                                    if (!et.isDir(n.mode)) throw new et.ErrnoError(54);
                                                }
                                                var a = { type: e, opts: t, mountpoint: r, mounts: [] },
                                                    u = e.mount(a);
                                                return (u.mount = a), (a.root = u), o ? (et.root = u) : n && ((n.mounted = a), n.mount && n.mount.mounts.push(a)), u;
                                            },
                                            unmount: function (e) {
                                                var t = et.lookupPath(e, { follow_mount: !1 });
                                                if (!et.isMountpoint(t.node)) throw new et.ErrnoError(28);
                                                var r = t.node,
                                                    n = r.mounted,
                                                    o = et.getMounts(n);
                                                Object.keys(et.nameTable).forEach(function (e) {
                                                    for (var t = et.nameTable[e]; t; ) {
                                                        var r = t.name_next;
                                                        -1 !== o.indexOf(t.mount) && et.destroyNode(t), (t = r);
                                                    }
                                                }),
                                                    (r.mounted = null);
                                                var i = r.mount.mounts.indexOf(n);
                                                r.mount.mounts.splice(i, 1);
                                            },
                                            lookup: function (e, t) {
                                                return e.node_ops.lookup(e, t);
                                            },
                                            mknod: function (e, t, r) {
                                                var n = et.lookupPath(e, { parent: !0 }).node,
                                                    o = Ge.basename(e);
                                                if (!o || "." === o || ".." === o) throw new et.ErrnoError(28);
                                                var i = et.mayCreate(n, o);
                                                if (i) throw new et.ErrnoError(i);
                                                if (!n.node_ops.mknod) throw new et.ErrnoError(63);
                                                return n.node_ops.mknod(n, o, t, r);
                                            },
                                            create: function (e, t) {
                                                return (t = void 0 !== t ? t : 438), (t &= 4095), (t |= 32768), et.mknod(e, t, 0);
                                            },
                                            mkdir: function (e, t) {
                                                return (t = void 0 !== t ? t : 511), (t &= 1023), (t |= 16384), et.mknod(e, t, 0);
                                            },
                                            mkdirTree: function (e, t) {
                                                for (var r = e.split("/"), n = "", o = 0; o < r.length; ++o)
                                                    if (r[o]) {
                                                        n += "/" + r[o];
                                                        try {
                                                            et.mkdir(n, t);
                                                        } catch (e) {
                                                            if (20 != e.errno) throw e;
                                                        }
                                                    }
                                            },
                                            mkdev: function (e, t, r) {
                                                return void 0 === r && ((r = t), (t = 438)), (t |= 8192), et.mknod(e, t, r);
                                            },
                                            symlink: function (e, t) {
                                                if (!Ke.resolve(e)) throw new et.ErrnoError(44);
                                                var r = et.lookupPath(t, { parent: !0 }).node;
                                                if (!r) throw new et.ErrnoError(44);
                                                var n = Ge.basename(t),
                                                    o = et.mayCreate(r, n);
                                                if (o) throw new et.ErrnoError(o);
                                                if (!r.node_ops.symlink) throw new et.ErrnoError(63);
                                                return r.node_ops.symlink(r, n, e);
                                            },
                                            rename: function (e, t) {
                                                var r,
                                                    n,
                                                    o = Ge.dirname(e),
                                                    i = Ge.dirname(t),
                                                    s = Ge.basename(e),
                                                    a = Ge.basename(t);
                                                if (((r = et.lookupPath(e, { parent: !0 }).node), (n = et.lookupPath(t, { parent: !0 }).node), !r || !n)) throw new et.ErrnoError(44);
                                                if (r.mount !== n.mount) throw new et.ErrnoError(75);
                                                var u,
                                                    l = et.lookupNode(r, s),
                                                    c = Ke.relative(e, i);
                                                if ("." !== c.charAt(0)) throw new et.ErrnoError(28);
                                                if ("." !== (c = Ke.relative(t, o)).charAt(0)) throw new et.ErrnoError(55);
                                                try {
                                                    u = et.lookupNode(n, a);
                                                } catch (e) {}
                                                if (l !== u) {
                                                    var f = et.isDir(l.mode),
                                                        d = et.mayDelete(r, s, f);
                                                    if (d) throw new et.ErrnoError(d);
                                                    if ((d = u ? et.mayDelete(n, a, f) : et.mayCreate(n, a))) throw new et.ErrnoError(d);
                                                    if (!r.node_ops.rename) throw new et.ErrnoError(63);
                                                    if (et.isMountpoint(l) || (u && et.isMountpoint(u))) throw new et.ErrnoError(10);
                                                    if (n !== r && (d = et.nodePermissions(r, "w"))) throw new et.ErrnoError(d);
                                                    try {
                                                        et.trackingDelegate.willMovePath && et.trackingDelegate.willMovePath(e, t);
                                                    } catch (r) {
                                                        k("FS.trackingDelegate['willMovePath']('" + e + "', '" + t + "') threw an exception: " + r.message);
                                                    }
                                                    et.hashRemoveNode(l);
                                                    try {
                                                        r.node_ops.rename(l, n, a);
                                                    } catch (e) {
                                                        throw e;
                                                    } finally {
                                                        et.hashAddNode(l);
                                                    }
                                                    try {
                                                        et.trackingDelegate.onMovePath && et.trackingDelegate.onMovePath(e, t);
                                                    } catch (r) {
                                                        k("FS.trackingDelegate['onMovePath']('" + e + "', '" + t + "') threw an exception: " + r.message);
                                                    }
                                                }
                                            },
                                            rmdir: function (e) {
                                                var t = et.lookupPath(e, { parent: !0 }).node,
                                                    r = Ge.basename(e),
                                                    n = et.lookupNode(t, r),
                                                    o = et.mayDelete(t, r, !0);
                                                if (o) throw new et.ErrnoError(o);
                                                if (!t.node_ops.rmdir) throw new et.ErrnoError(63);
                                                if (et.isMountpoint(n)) throw new et.ErrnoError(10);
                                                try {
                                                    et.trackingDelegate.willDeletePath && et.trackingDelegate.willDeletePath(e);
                                                } catch (t) {
                                                    k("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + t.message);
                                                }
                                                t.node_ops.rmdir(t, r), et.destroyNode(n);
                                                try {
                                                    et.trackingDelegate.onDeletePath && et.trackingDelegate.onDeletePath(e);
                                                } catch (t) {
                                                    k("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + t.message);
                                                }
                                            },
                                            readdir: function (e) {
                                                var t = et.lookupPath(e, { follow: !0 }).node;
                                                if (!t.node_ops.readdir) throw new et.ErrnoError(54);
                                                return t.node_ops.readdir(t);
                                            },
                                            unlink: function (e) {
                                                var t = et.lookupPath(e, { parent: !0 }).node,
                                                    r = Ge.basename(e),
                                                    n = et.lookupNode(t, r),
                                                    o = et.mayDelete(t, r, !1);
                                                if (o) throw new et.ErrnoError(o);
                                                if (!t.node_ops.unlink) throw new et.ErrnoError(63);
                                                if (et.isMountpoint(n)) throw new et.ErrnoError(10);
                                                try {
                                                    et.trackingDelegate.willDeletePath && et.trackingDelegate.willDeletePath(e);
                                                } catch (t) {
                                                    k("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + t.message);
                                                }
                                                t.node_ops.unlink(t, r), et.destroyNode(n);
                                                try {
                                                    et.trackingDelegate.onDeletePath && et.trackingDelegate.onDeletePath(e);
                                                } catch (t) {
                                                    k("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + t.message);
                                                }
                                            },
                                            readlink: function (e) {
                                                var t = et.lookupPath(e).node;
                                                if (!t) throw new et.ErrnoError(44);
                                                if (!t.node_ops.readlink) throw new et.ErrnoError(28);
                                                return Ke.resolve(et.getPath(t.parent), t.node_ops.readlink(t));
                                            },
                                            stat: function (e, t) {
                                                var r = et.lookupPath(e, { follow: !t }).node;
                                                if (!r) throw new et.ErrnoError(44);
                                                if (!r.node_ops.getattr) throw new et.ErrnoError(63);
                                                return r.node_ops.getattr(r);
                                            },
                                            lstat: function (e) {
                                                return et.stat(e, !0);
                                            },
                                            chmod: function (e, t, r) {
                                                var n;
                                                if (!(n = "string" == typeof e ? et.lookupPath(e, { follow: !r }).node : e).node_ops.setattr) throw new et.ErrnoError(63);
                                                n.node_ops.setattr(n, { mode: (4095 & t) | (-4096 & n.mode), timestamp: Date.now() });
                                            },
                                            lchmod: function (e, t) {
                                                et.chmod(e, t, !0);
                                            },
                                            fchmod: function (e, t) {
                                                var r = et.getStream(e);
                                                if (!r) throw new et.ErrnoError(8);
                                                et.chmod(r.node, t);
                                            },
                                            chown: function (e, t, r, n) {
                                                var o;
                                                if (!(o = "string" == typeof e ? et.lookupPath(e, { follow: !n }).node : e).node_ops.setattr) throw new et.ErrnoError(63);
                                                o.node_ops.setattr(o, { timestamp: Date.now() });
                                            },
                                            lchown: function (e, t, r) {
                                                et.chown(e, t, r, !0);
                                            },
                                            fchown: function (e, t, r) {
                                                var n = et.getStream(e);
                                                if (!n) throw new et.ErrnoError(8);
                                                et.chown(n.node, t, r);
                                            },
                                            truncate: function (e, t) {
                                                if (t < 0) throw new et.ErrnoError(28);
                                                var r;
                                                if (!(r = "string" == typeof e ? et.lookupPath(e, { follow: !0 }).node : e).node_ops.setattr) throw new et.ErrnoError(63);
                                                if (et.isDir(r.mode)) throw new et.ErrnoError(31);
                                                if (!et.isFile(r.mode)) throw new et.ErrnoError(28);
                                                var n = et.nodePermissions(r, "w");
                                                if (n) throw new et.ErrnoError(n);
                                                r.node_ops.setattr(r, { size: t, timestamp: Date.now() });
                                            },
                                            ftruncate: function (e, t) {
                                                var r = et.getStream(e);
                                                if (!r) throw new et.ErrnoError(8);
                                                if (0 == (2097155 & r.flags)) throw new et.ErrnoError(28);
                                                et.truncate(r.node, t);
                                            },
                                            utime: function (e, t, r) {
                                                var n = et.lookupPath(e, { follow: !0 }).node;
                                                n.node_ops.setattr(n, { timestamp: Math.max(t, r) });
                                            },
                                            open: function (e, t, r, n, o) {
                                                if ("" === e) throw new et.ErrnoError(44);
                                                var s;
                                                if (((r = void 0 === r ? 438 : r), (r = 64 & (t = "string" == typeof t ? et.modeStringToFlags(t) : t) ? (4095 & r) | 32768 : 0), "object" == typeof e)) s = e;
                                                else {
                                                    e = Ge.normalize(e);
                                                    try {
                                                        s = et.lookupPath(e, { follow: !(131072 & t) }).node;
                                                    } catch (e) {}
                                                }
                                                var a = !1;
                                                if (64 & t)
                                                    if (s) {
                                                        if (128 & t) throw new et.ErrnoError(20);
                                                    } else (s = et.mknod(e, r, 0)), (a = !0);
                                                if (!s) throw new et.ErrnoError(44);
                                                if ((et.isChrdev(s.mode) && (t &= -513), 65536 & t && !et.isDir(s.mode))) throw new et.ErrnoError(54);
                                                if (!a) {
                                                    var u = et.mayOpen(s, t);
                                                    if (u) throw new et.ErrnoError(u);
                                                }
                                                512 & t && et.truncate(s, 0), (t &= -131713);
                                                var l = et.createStream({ node: s, path: et.getPath(s), flags: t, seekable: !0, position: 0, stream_ops: s.stream_ops, ungotten: [], error: !1 }, n, o);
                                                l.stream_ops.open && l.stream_ops.open(l),
                                                !i.logReadFiles || 1 & t || (et.readFiles || (et.readFiles = {}), e in et.readFiles || ((et.readFiles[e] = 1), k("FS.trackingDelegate error on read file: " + e)));
                                                try {
                                                    if (et.trackingDelegate.onOpenFile) {
                                                        var c = 0;
                                                        1 != (2097155 & t) && (c |= et.tracking.openFlags.READ), 0 != (2097155 & t) && (c |= et.tracking.openFlags.WRITE), et.trackingDelegate.onOpenFile(e, c);
                                                    }
                                                } catch (t) {
                                                    k("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + t.message);
                                                }
                                                return l;
                                            },
                                            close: function (e) {
                                                if (et.isClosed(e)) throw new et.ErrnoError(8);
                                                e.getdents && (e.getdents = null);
                                                try {
                                                    e.stream_ops.close && e.stream_ops.close(e);
                                                } catch (e) {
                                                    throw e;
                                                } finally {
                                                    et.closeStream(e.fd);
                                                }
                                                e.fd = null;
                                            },
                                            isClosed: function (e) {
                                                return null === e.fd;
                                            },
                                            llseek: function (e, t, r) {
                                                if (et.isClosed(e)) throw new et.ErrnoError(8);
                                                if (!e.seekable || !e.stream_ops.llseek) throw new et.ErrnoError(70);
                                                if (0 != r && 1 != r && 2 != r) throw new et.ErrnoError(28);
                                                return (e.position = e.stream_ops.llseek(e, t, r)), (e.ungotten = []), e.position;
                                            },
                                            read: function (e, t, r, n, o) {
                                                if (n < 0 || o < 0) throw new et.ErrnoError(28);
                                                if (et.isClosed(e)) throw new et.ErrnoError(8);
                                                if (1 == (2097155 & e.flags)) throw new et.ErrnoError(8);
                                                if (et.isDir(e.node.mode)) throw new et.ErrnoError(31);
                                                if (!e.stream_ops.read) throw new et.ErrnoError(28);
                                                var i = void 0 !== o;
                                                if (i) {
                                                    if (!e.seekable) throw new et.ErrnoError(70);
                                                } else o = e.position;
                                                var s = e.stream_ops.read(e, t, r, n, o);
                                                return i || (e.position += s), s;
                                            },
                                            write: function (e, t, r, n, o, i) {
                                                if (n < 0 || o < 0) throw new et.ErrnoError(28);
                                                if (et.isClosed(e)) throw new et.ErrnoError(8);
                                                if (0 == (2097155 & e.flags)) throw new et.ErrnoError(8);
                                                if (et.isDir(e.node.mode)) throw new et.ErrnoError(31);
                                                if (!e.stream_ops.write) throw new et.ErrnoError(28);
                                                e.seekable && 1024 & e.flags && et.llseek(e, 0, 2);
                                                var s = void 0 !== o;
                                                if (s) {
                                                    if (!e.seekable) throw new et.ErrnoError(70);
                                                } else o = e.position;
                                                var a = e.stream_ops.write(e, t, r, n, o, i);
                                                s || (e.position += a);
                                                try {
                                                    e.path && et.trackingDelegate.onWriteToFile && et.trackingDelegate.onWriteToFile(e.path);
                                                } catch (t) {
                                                    k("FS.trackingDelegate['onWriteToFile']('" + e.path + "') threw an exception: " + t.message);
                                                }
                                                return a;
                                            },
                                            allocate: function (e, t, r) {
                                                if (et.isClosed(e)) throw new et.ErrnoError(8);
                                                if (t < 0 || r <= 0) throw new et.ErrnoError(28);
                                                if (0 == (2097155 & e.flags)) throw new et.ErrnoError(8);
                                                if (!et.isFile(e.node.mode) && !et.isDir(e.node.mode)) throw new et.ErrnoError(43);
                                                if (!e.stream_ops.allocate) throw new et.ErrnoError(138);
                                                e.stream_ops.allocate(e, t, r);
                                            },
                                            mmap: function (e, t, r, n, o, i) {
                                                if (0 != (2 & o) && 0 == (2 & i) && 2 != (2097155 & e.flags)) throw new et.ErrnoError(2);
                                                if (1 == (2097155 & e.flags)) throw new et.ErrnoError(2);
                                                if (!e.stream_ops.mmap) throw new et.ErrnoError(43);
                                                return e.stream_ops.mmap(e, t, r, n, o, i);
                                            },
                                            msync: function (e, t, r, n, o) {
                                                return e && e.stream_ops.msync ? e.stream_ops.msync(e, t, r, n, o) : 0;
                                            },
                                            munmap: function (e) {
                                                return 0;
                                            },
                                            ioctl: function (e, t, r) {
                                                if (!e.stream_ops.ioctl) throw new et.ErrnoError(59);
                                                return e.stream_ops.ioctl(e, t, r);
                                            },
                                            readFile: function (e, t) {
                                                if ((((t = t || {}).flags = t.flags || 0), (t.encoding = t.encoding || "binary"), "utf8" !== t.encoding && "binary" !== t.encoding))
                                                    throw new Error('Invalid encoding type "' + t.encoding + '"');
                                                var r,
                                                    n = et.open(e, t.flags),
                                                    o = et.stat(e).size,
                                                    i = new Uint8Array(o);
                                                return et.read(n, i, 0, o, 0), "utf8" === t.encoding ? (r = Z(i, 0)) : "binary" === t.encoding && (r = i), et.close(n), r;
                                            },
                                            writeFile: function (e, t, r) {
                                                (r = r || {}).flags = r.flags || 577;
                                                var n = et.open(e, r.flags, r.mode);
                                                if ("string" == typeof t) {
                                                    var o = new Uint8Array(ne(t) + 1),
                                                        i = te(t, o, 0, o.length);
                                                    et.write(n, o, 0, i, void 0, r.canOwn);
                                                } else {
                                                    if (!ArrayBuffer.isView(t)) throw new Error("Unsupported data type");
                                                    et.write(n, t, 0, t.byteLength, void 0, r.canOwn);
                                                }
                                                et.close(n);
                                            },
                                            cwd: function () {
                                                return et.currentPath;
                                            },
                                            chdir: function (e) {
                                                var t = et.lookupPath(e, { follow: !0 });
                                                if (null === t.node) throw new et.ErrnoError(44);
                                                if (!et.isDir(t.node.mode)) throw new et.ErrnoError(54);
                                                var r = et.nodePermissions(t.node, "x");
                                                if (r) throw new et.ErrnoError(r);
                                                et.currentPath = t.path;
                                            },
                                            createDefaultDirectories: function () {
                                                et.mkdir("/tmp"), et.mkdir("/home"), et.mkdir("/home/web_user");
                                            },
                                            createDefaultDevices: function () {
                                                et.mkdir("/dev"),
                                                    et.registerDevice(et.makedev(1, 3), {
                                                        read: function () {
                                                            return 0;
                                                        },
                                                        write: function (e, t, r, n, o) {
                                                            return n;
                                                        },
                                                    }),
                                                    et.mkdev("/dev/null", et.makedev(1, 3)),
                                                    Ye.register(et.makedev(5, 0), Ye.default_tty_ops),
                                                    Ye.register(et.makedev(6, 0), Ye.default_tty1_ops),
                                                    et.mkdev("/dev/tty", et.makedev(5, 0)),
                                                    et.mkdev("/dev/tty1", et.makedev(6, 0));
                                                var e = $e();
                                                et.createDevice("/dev", "random", e), et.createDevice("/dev", "urandom", e), et.mkdir("/dev/shm"), et.mkdir("/dev/shm/tmp");
                                            },
                                            createSpecialDirectories: function () {
                                                et.mkdir("/proc");
                                                var e = et.mkdir("/proc/self");
                                                et.mkdir("/proc/self/fd"),
                                                    et.mount(
                                                        {
                                                            mount: function () {
                                                                var t = et.createNode(e, "fd", 16895, 73);
                                                                return (
                                                                    (t.node_ops = {
                                                                        lookup: function (e, t) {
                                                                            var r = +t,
                                                                                n = et.getStream(r);
                                                                            if (!n) throw new et.ErrnoError(8);
                                                                            var o = {
                                                                                parent: null,
                                                                                mount: { mountpoint: "fake" },
                                                                                node_ops: {
                                                                                    readlink: function () {
                                                                                        return n.path;
                                                                                    },
                                                                                },
                                                                            };
                                                                            return (o.parent = o), o;
                                                                        },
                                                                    }),
                                                                        t
                                                                );
                                                            },
                                                        },
                                                        {},
                                                        "/proc/self/fd"
                                                    );
                                            },
                                            createStandardStreams: function () {
                                                i.stdin ? et.createDevice("/dev", "stdin", i.stdin) : et.symlink("/dev/tty", "/dev/stdin"),
                                                    i.stdout ? et.createDevice("/dev", "stdout", null, i.stdout) : et.symlink("/dev/tty", "/dev/stdout"),
                                                    i.stderr ? et.createDevice("/dev", "stderr", null, i.stderr) : et.symlink("/dev/tty1", "/dev/stderr"),
                                                    et.open("/dev/stdin", 0),
                                                    et.open("/dev/stdout", 1),
                                                    et.open("/dev/stderr", 1);
                                            },
                                            ensureErrnoError: function () {
                                                et.ErrnoError ||
                                                ((et.ErrnoError = function (e, t) {
                                                    (this.node = t),
                                                        (this.setErrno = function (e) {
                                                            this.errno = e;
                                                        }),
                                                        this.setErrno(e),
                                                        (this.message = "FS error");
                                                }),
                                                    (et.ErrnoError.prototype = new Error()),
                                                    (et.ErrnoError.prototype.constructor = et.ErrnoError),
                                                    [44].forEach(function (e) {
                                                        (et.genericErrors[e] = new et.ErrnoError(e)), (et.genericErrors[e].stack = "<generic error, no stack>");
                                                    }));
                                            },
                                            staticInit: function () {
                                                et.ensureErrnoError(),
                                                    (et.nameTable = new Array(4096)),
                                                    et.mount(Ze, {}, "/"),
                                                    et.createDefaultDirectories(),
                                                    et.createDefaultDevices(),
                                                    et.createSpecialDirectories(),
                                                    (et.filesystems = { MEMFS: Ze });
                                            },
                                            init: function (e, t, r) {
                                                (et.init.initialized = !0), et.ensureErrnoError(), (i.stdin = e || i.stdin), (i.stdout = t || i.stdout), (i.stderr = r || i.stderr), et.createStandardStreams();
                                            },
                                            quit: function () {
                                                et.init.initialized = !1;
                                                var e = i._fflush;
                                                e && e(0);
                                                for (var t = 0; t < et.streams.length; t++) {
                                                    var r = et.streams[t];
                                                    r && et.close(r);
                                                }
                                            },
                                            getMode: function (e, t) {
                                                var r = 0;
                                                return e && (r |= 365), t && (r |= 146), r;
                                            },
                                            findObject: function (e, t) {
                                                var r = et.analyzePath(e, t);
                                                return r.exists ? r.object : null;
                                            },
                                            analyzePath: function (e, t) {
                                                try {
                                                    e = (n = et.lookupPath(e, { follow: !t })).path;
                                                } catch (e) {}
                                                var r = { isRoot: !1, exists: !1, error: 0, name: null, path: null, object: null, parentExists: !1, parentPath: null, parentObject: null };
                                                try {
                                                    var n = et.lookupPath(e, { parent: !0 });
                                                    (r.parentExists = !0),
                                                        (r.parentPath = n.path),
                                                        (r.parentObject = n.node),
                                                        (r.name = Ge.basename(e)),
                                                        (n = et.lookupPath(e, { follow: !t })),
                                                        (r.exists = !0),
                                                        (r.path = n.path),
                                                        (r.object = n.node),
                                                        (r.name = n.node.name),
                                                        (r.isRoot = "/" === n.path);
                                                } catch (e) {
                                                    r.error = e.errno;
                                                }
                                                return r;
                                            },
                                            createPath: function (e, t, r, n) {
                                                e = "string" == typeof e ? e : et.getPath(e);
                                                for (var o = t.split("/").reverse(); o.length; ) {
                                                    var i = o.pop();
                                                    if (i) {
                                                        var s = Ge.join2(e, i);
                                                        try {
                                                            et.mkdir(s);
                                                        } catch (e) {}
                                                        e = s;
                                                    }
                                                }
                                                return s;
                                            },
                                            createFile: function (e, t, r, n, o) {
                                                var i = Ge.join2("string" == typeof e ? e : et.getPath(e), t),
                                                    s = et.getMode(n, o);
                                                return et.create(i, s);
                                            },
                                            createDataFile: function (e, t, r, n, o, i) {
                                                var s = t ? Ge.join2("string" == typeof e ? e : et.getPath(e), t) : e,
                                                    a = et.getMode(n, o),
                                                    u = et.create(s, a);
                                                if (r) {
                                                    if ("string" == typeof r) {
                                                        for (var l = new Array(r.length), c = 0, f = r.length; c < f; ++c) l[c] = r.charCodeAt(c);
                                                        r = l;
                                                    }
                                                    et.chmod(u, 146 | a);
                                                    var d = et.open(u, 577);
                                                    et.write(d, r, 0, r.length, 0, i), et.close(d), et.chmod(u, a);
                                                }
                                                return u;
                                            },
                                            createDevice: function (e, t, r, n) {
                                                var o = Ge.join2("string" == typeof e ? e : et.getPath(e), t),
                                                    i = et.getMode(!!r, !!n);
                                                et.createDevice.major || (et.createDevice.major = 64);
                                                var s = et.makedev(et.createDevice.major++, 0);
                                                return (
                                                    et.registerDevice(s, {
                                                        open: function (e) {
                                                            e.seekable = !1;
                                                        },
                                                        close: function (e) {
                                                            n && n.buffer && n.buffer.length && n(10);
                                                        },
                                                        read: function (e, t, n, o, i) {
                                                            for (var s = 0, a = 0; a < o; a++) {
                                                                var u;
                                                                try {
                                                                    u = r();
                                                                } catch (e) {
                                                                    throw new et.ErrnoError(29);
                                                                }
                                                                if (void 0 === u && 0 === s) throw new et.ErrnoError(6);
                                                                if (null == u) break;
                                                                s++, (t[n + a] = u);
                                                            }
                                                            return s && (e.node.timestamp = Date.now()), s;
                                                        },
                                                        write: function (e, t, r, o, i) {
                                                            for (var s = 0; s < o; s++)
                                                                try {
                                                                    n(t[r + s]);
                                                                } catch (e) {
                                                                    throw new et.ErrnoError(29);
                                                                }
                                                            return o && (e.node.timestamp = Date.now()), s;
                                                        },
                                                    }),
                                                        et.mkdev(o, i, s)
                                                );
                                            },
                                            forceLoadFile: function (e) {
                                                if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
                                                if ("undefined" != typeof XMLHttpRequest)
                                                    throw new Error(
                                                        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
                                                    );
                                                if (!m) throw new Error("Cannot load without read() or XMLHttpRequest.");
                                                try {
                                                    (e.contents = $t(m(e.url), !0)), (e.usedBytes = e.contents.length);
                                                } catch (e) {
                                                    throw new et.ErrnoError(29);
                                                }
                                            },
                                            createLazyFile: function (e, t, r, n, o) {
                                                function i() {
                                                    (this.lengthKnown = !1), (this.chunks = []);
                                                }
                                                if (
                                                    ((i.prototype.get = function (e) {
                                                        if (!(e > this.length - 1 || e < 0)) {
                                                            var t = e % this.chunkSize,
                                                                r = (e / this.chunkSize) | 0;
                                                            return this.getter(r)[t];
                                                        }
                                                    }),
                                                        (i.prototype.setDataGetter = function (e) {
                                                            this.getter = e;
                                                        }),
                                                        (i.prototype.cacheLength = function () {
                                                            var e = new XMLHttpRequest();
                                                            if ((e.open("HEAD", r, !1), e.send(null), !((e.status >= 200 && e.status < 300) || 304 === e.status))) throw new Error("Couldn't load " + r + ". Status: " + e.status);
                                                            var t,
                                                                n = Number(e.getResponseHeader("Content-length")),
                                                                o = (t = e.getResponseHeader("Accept-Ranges")) && "bytes" === t,
                                                                i = (t = e.getResponseHeader("Content-Encoding")) && "gzip" === t,
                                                                s = 1048576;
                                                            o || (s = n);
                                                            var a = this;
                                                            a.setDataGetter(function (e) {
                                                                var t = e * s,
                                                                    o = (e + 1) * s - 1;
                                                                if (
                                                                    ((o = Math.min(o, n - 1)),
                                                                    void 0 === a.chunks[e] &&
                                                                    (a.chunks[e] = (function (e, t) {
                                                                        if (e > t) throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
                                                                        if (t > n - 1) throw new Error("only " + n + " bytes available! programmer error!");
                                                                        var o = new XMLHttpRequest();
                                                                        if (
                                                                            (o.open("GET", r, !1),
                                                                            n !== s && o.setRequestHeader("Range", "bytes=" + e + "-" + t),
                                                                            "undefined" != typeof Uint8Array && (o.responseType = "arraybuffer"),
                                                                            o.overrideMimeType && o.overrideMimeType("text/plain; charset=x-user-defined"),
                                                                                o.send(null),
                                                                                !((o.status >= 200 && o.status < 300) || 304 === o.status))
                                                                        )
                                                                            throw new Error("Couldn't load " + r + ". Status: " + o.status);
                                                                        return void 0 !== o.response ? new Uint8Array(o.response || []) : $t(o.responseText || "", !0);
                                                                    })(t, o)),
                                                                    void 0 === a.chunks[e])
                                                                )
                                                                    throw new Error("doXHR failed!");
                                                                return a.chunks[e];
                                                            }),
                                                            (!i && n) || ((s = n = 1), (n = this.getter(0).length), (s = n), E("LazyFiles on gzip forces download of the whole file when length is accessed")),
                                                                (this._length = n),
                                                                (this._chunkSize = s),
                                                                (this.lengthKnown = !0);
                                                        }),
                                                    "undefined" != typeof XMLHttpRequest)
                                                ) {
                                                    if (!d) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                                                    var s = new i();
                                                    Object.defineProperties(s, {
                                                        length: {
                                                            get: function () {
                                                                return this.lengthKnown || this.cacheLength(), this._length;
                                                            },
                                                        },
                                                        chunkSize: {
                                                            get: function () {
                                                                return this.lengthKnown || this.cacheLength(), this._chunkSize;
                                                            },
                                                        },
                                                    });
                                                    var a = { isDevice: !1, contents: s };
                                                } else a = { isDevice: !1, url: r };
                                                var u = et.createFile(e, t, a, n, o);
                                                a.contents ? (u.contents = a.contents) : a.url && ((u.contents = null), (u.url = a.url)),
                                                    Object.defineProperties(u, {
                                                        usedBytes: {
                                                            get: function () {
                                                                return this.contents.length;
                                                            },
                                                        },
                                                    });
                                                var l = {};
                                                return (
                                                    Object.keys(u.stream_ops).forEach(function (e) {
                                                        var t = u.stream_ops[e];
                                                        l[e] = function () {
                                                            return et.forceLoadFile(u), t.apply(null, arguments);
                                                        };
                                                    }),
                                                        (l.read = function (e, t, r, n, o) {
                                                            et.forceLoadFile(u);
                                                            var i = e.node.contents;
                                                            if (o >= i.length) return 0;
                                                            var s = Math.min(i.length - o, n);
                                                            if (i.slice) for (var a = 0; a < s; a++) t[r + a] = i[o + a];
                                                            else for (a = 0; a < s; a++) t[r + a] = i.get(o + a);
                                                            return s;
                                                        }),
                                                        (u.stream_ops = l),
                                                        u
                                                );
                                            },
                                            createPreloadedFile: function (e, t, r, n, o, s, a, u, l, c) {
                                                Browser.init();
                                                var f = t ? Ke.resolve(Ge.join2(e, t)) : e;
                                                function d(r) {
                                                    function d(r) {
                                                        c && c(), u || et.createDataFile(e, t, r, n, o, l), s && s(), xe();
                                                    }
                                                    var h = !1;
                                                    i.preloadPlugins.forEach(function (e) {
                                                        h ||
                                                        (e.canHandle(f) &&
                                                            (e.handle(r, f, d, function () {
                                                                a && a(), xe();
                                                            }),
                                                                (h = !0)));
                                                    }),
                                                    h || d(r);
                                                }
                                                qe(),
                                                    "string" == typeof r
                                                        ? Browser.asyncLoad(
                                                        r,
                                                        function (e) {
                                                            d(e);
                                                        },
                                                        a
                                                        )
                                                        : d(r);
                                            },
                                            indexedDB: function () {
                                                return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                                            },
                                            DB_NAME: function () {
                                                return "EM_FS_" + window.location.pathname;
                                            },
                                            DB_VERSION: 20,
                                            DB_STORE_NAME: "FILE_DATA",
                                            saveFilesToDB: function (e, t, r) {
                                                (t = t || function () {}), (r = r || function () {});
                                                var n = et.indexedDB();
                                                try {
                                                    var o = n.open(et.DB_NAME(), et.DB_VERSION);
                                                } catch (e) {
                                                    return r(e);
                                                }
                                                (o.onupgradeneeded = function () {
                                                    E("creating db"), o.result.createObjectStore(et.DB_STORE_NAME);
                                                }),
                                                    (o.onsuccess = function () {
                                                        var n = o.result.transaction([et.DB_STORE_NAME], "readwrite"),
                                                            i = n.objectStore(et.DB_STORE_NAME),
                                                            s = 0,
                                                            a = 0,
                                                            u = e.length;
                                                        function l() {
                                                            0 == a ? t() : r();
                                                        }
                                                        e.forEach(function (e) {
                                                            var t = i.put(et.analyzePath(e).object.contents, e);
                                                            (t.onsuccess = function () {
                                                                ++s + a == u && l();
                                                            }),
                                                                (t.onerror = function () {
                                                                    a++, s + a == u && l();
                                                                });
                                                        }),
                                                            (n.onerror = r);
                                                    }),
                                                    (o.onerror = r);
                                            },
                                            loadFilesFromDB: function (e, t, r) {
                                                (t = t || function () {}), (r = r || function () {});
                                                var n = et.indexedDB();
                                                try {
                                                    var o = n.open(et.DB_NAME(), et.DB_VERSION);
                                                } catch (e) {
                                                    return r(e);
                                                }
                                                (o.onupgradeneeded = r),
                                                    (o.onsuccess = function () {
                                                        var n = o.result;
                                                        try {
                                                            var i = n.transaction([et.DB_STORE_NAME], "readonly");
                                                        } catch (e) {
                                                            return void r(e);
                                                        }
                                                        var s = i.objectStore(et.DB_STORE_NAME),
                                                            a = 0,
                                                            u = 0,
                                                            l = e.length;
                                                        function c() {
                                                            0 == u ? t() : r();
                                                        }
                                                        e.forEach(function (e) {
                                                            var t = s.get(e);
                                                            (t.onsuccess = function () {
                                                                et.analyzePath(e).exists && et.unlink(e), et.createDataFile(Ge.dirname(e), Ge.basename(e), t.result, !0, !0, !0), ++a + u == l && c();
                                                            }),
                                                                (t.onerror = function () {
                                                                    u++, a + u == l && c();
                                                                });
                                                        }),
                                                            (i.onerror = r);
                                                    }),
                                                    (o.onerror = r);
                                            },
                                        },
                                        tt = {
                                            mappings: {},
                                            DEFAULT_POLLMASK: 5,
                                            umask: 511,
                                            calculateAt: function (e, t, r) {
                                                if ("/" === t[0]) return t;
                                                var n;
                                                if (-100 === e) n = et.cwd();
                                                else {
                                                    var o = et.getStream(e);
                                                    if (!o) throw new et.ErrnoError(8);
                                                    n = o.path;
                                                }
                                                if (0 == t.length) {
                                                    if (!r) throw new et.ErrnoError(44);
                                                    return n;
                                                }
                                                return Ge.join2(n, t);
                                            },
                                            doStat: function (e, t, r) {
                                                try {
                                                    var n = e(t);
                                                } catch (e) {
                                                    if (e && e.node && Ge.normalize(t) !== Ge.normalize(et.getPath(e.node))) return -54;
                                                    throw e;
                                                }
                                                return (
                                                    (K[r >> 2] = n.dev),
                                                        (K[(r + 4) >> 2] = 0),
                                                        (K[(r + 8) >> 2] = n.ino),
                                                        (K[(r + 12) >> 2] = n.mode),
                                                        (K[(r + 16) >> 2] = n.nlink),
                                                        (K[(r + 20) >> 2] = n.uid),
                                                        (K[(r + 24) >> 2] = n.gid),
                                                        (K[(r + 28) >> 2] = n.rdev),
                                                        (K[(r + 32) >> 2] = 0),
                                                        (Oe = [
                                                            n.size >>> 0,
                                                            ((ze = n.size), +Math.abs(ze) >= 1 ? (ze > 0 ? (0 | Math.min(+Math.floor(ze / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ze - +(~~ze >>> 0)) / 4294967296) >>> 0) : 0),
                                                        ]),
                                                        (K[(r + 40) >> 2] = Oe[0]),
                                                        (K[(r + 44) >> 2] = Oe[1]),
                                                        (K[(r + 48) >> 2] = 4096),
                                                        (K[(r + 52) >> 2] = n.blocks),
                                                        (K[(r + 56) >> 2] = (n.atime.getTime() / 1e3) | 0),
                                                        (K[(r + 60) >> 2] = 0),
                                                        (K[(r + 64) >> 2] = (n.mtime.getTime() / 1e3) | 0),
                                                        (K[(r + 68) >> 2] = 0),
                                                        (K[(r + 72) >> 2] = (n.ctime.getTime() / 1e3) | 0),
                                                        (K[(r + 76) >> 2] = 0),
                                                        (Oe = [
                                                            n.ino >>> 0,
                                                            ((ze = n.ino), +Math.abs(ze) >= 1 ? (ze > 0 ? (0 | Math.min(+Math.floor(ze / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ze - +(~~ze >>> 0)) / 4294967296) >>> 0) : 0),
                                                        ]),
                                                        (K[(r + 80) >> 2] = Oe[0]),
                                                        (K[(r + 84) >> 2] = Oe[1]),
                                                        0
                                                );
                                            },
                                            doMsync: function (e, t, r, n, o) {
                                                var i = G.slice(e, e + r);
                                                et.msync(t, i, o, r, n);
                                            },
                                            doMkdir: function (e, t) {
                                                return "/" === (e = Ge.normalize(e))[e.length - 1] && (e = e.substr(0, e.length - 1)), et.mkdir(e, t, 0), 0;
                                            },
                                            doMknod: function (e, t, r) {
                                                switch (61440 & t) {
                                                    case 32768:
                                                    case 8192:
                                                    case 24576:
                                                    case 4096:
                                                    case 49152:
                                                        break;
                                                    default:
                                                        return -28;
                                                }
                                                return et.mknod(e, t, r), 0;
                                            },
                                            doReadlink: function (e, t, r) {
                                                if (r <= 0) return -28;
                                                var n = et.readlink(e),
                                                    o = Math.min(r, ne(n)),
                                                    i = X[t + o];
                                                return re(n, t, r + 1), (X[t + o] = i), o;
                                            },
                                            doAccess: function (e, t) {
                                                if (-8 & t) return -28;
                                                var r;
                                                if (!(r = et.lookupPath(e, { follow: !0 }).node)) return -44;
                                                var n = "";
                                                return 4 & t && (n += "r"), 2 & t && (n += "w"), 1 & t && (n += "x"), n && et.nodePermissions(r, n) ? -2 : 0;
                                            },
                                            doDup: function (e, t, r) {
                                                var n = et.getStream(r);
                                                return n && et.close(n), et.open(e, t, 0, r, r).fd;
                                            },
                                            doReadv: function (e, t, r, n) {
                                                for (var o = 0, i = 0; i < r; i++) {
                                                    var s = K[(t + 8 * i) >> 2],
                                                        a = K[(t + (8 * i + 4)) >> 2],
                                                        u = et.read(e, X, s, a, n);
                                                    if (u < 0) return -1;
                                                    if (((o += u), u < a)) break;
                                                }
                                                return o;
                                            },
                                            doWritev: function (e, t, r, n) {
                                                for (var o = 0, i = 0; i < r; i++) {
                                                    var s = K[(t + 8 * i) >> 2],
                                                        a = K[(t + (8 * i + 4)) >> 2],
                                                        u = et.write(e, X, s, a, n);
                                                    if (u < 0) return -1;
                                                    o += u;
                                                }
                                                return o;
                                            },
                                            varargs: void 0,
                                            get: function () {
                                                return (tt.varargs += 4), K[(tt.varargs - 4) >> 2];
                                            },
                                            getStr: function (e) {
                                                return ee(e);
                                            },
                                            getStreamFromFD: function (e) {
                                                var t = et.getStream(e);
                                                if (!t) throw new et.ErrnoError(8);
                                                return t;
                                            },
                                            get64: function (e, t) {
                                                return e;
                                            },
                                        };
                                    function rt(e, t) {
                                        try {
                                            return (e = tt.getStr(e)), tt.doAccess(e, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function nt(e, t) {
                                        try {
                                            return (e = tt.getStr(e)), et.chmod(e, t), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function ot(e, t, r) {
                                        try {
                                            return (e = tt.getStr(e)), et.chown(e, t, r), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function it(e, t) {
                                        try {
                                            return et.fchmod(e, t), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function st(e, t, r) {
                                        try {
                                            return et.fchown(e, t, r), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function at(e) {
                                        return (K[Jt() >> 2] = e), e;
                                    }
                                    function ut(e, t, r) {
                                        tt.varargs = r;
                                        try {
                                            var n = tt.getStreamFromFD(e);
                                            switch (t) {
                                                case 0:
                                                    return (o = tt.get()) < 0 ? -28 : et.open(n.path, n.flags, 0, o).fd;
                                                case 1:
                                                case 2:
                                                    return 0;
                                                case 3:
                                                    return n.flags;
                                                case 4:
                                                    var o = tt.get();
                                                    return (n.flags |= o), 0;
                                                case 12:
                                                    return (o = tt.get()), ($[(o + 0) >> 1] = 2), 0;
                                                case 13:
                                                case 14:
                                                    return 0;
                                                case 16:
                                                case 8:
                                                    return -28;
                                                case 9:
                                                    return at(28), -1;
                                                default:
                                                    return -28;
                                            }
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function lt(e, t) {
                                        try {
                                            var r = tt.getStreamFromFD(e);
                                            return tt.doStat(et.stat, r.path, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function ct(e, t, r, n) {
                                        try {
                                            var o = tt.get64(r, n);
                                            return et.ftruncate(e, o), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function ft(e, t) {
                                        try {
                                            if (0 === t) return -28;
                                            var r = et.cwd();
                                            return t < ne(r) + 1 ? -68 : (re(r, e, t), e);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function dt() {
                                        return 0;
                                    }
                                    function ht() {
                                        return 42;
                                    }
                                    function pt(e, t) {
                                        try {
                                            return (e = tt.getStr(e)), tt.doStat(et.lstat, e, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function mt(e, t) {
                                        try {
                                            return (e = tt.getStr(e)), tt.doMkdir(e, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function _t(e, t, r, n, o, i) {
                                        var s;
                                        i <<= 12;
                                        var a = !1;
                                        if (0 != (16 & n) && e % 16384 != 0) return -28;
                                        if (0 != (32 & n)) {
                                            if (!(s = ar(16384, t))) return -48;
                                            Qt(s, 0, t), (a = !0);
                                        } else {
                                            var u = et.getStream(o);
                                            if (!u) return -8;
                                            var l = et.mmap(u, e, t, i, r, n);
                                            (s = l.ptr), (a = l.allocated);
                                        }
                                        return (tt.mappings[s] = { malloc: s, len: t, allocated: a, fd: o, prot: r, flags: n, offset: i }), s;
                                    }
                                    function gt(e, t, r, n, o, i) {
                                        try {
                                            return _t(e, t, r, n, o, i);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function vt(e, t) {
                                        if (-1 == (0 | e) || 0 === t) return -28;
                                        var r = tt.mappings[e];
                                        if (!r) return 0;
                                        if (t === r.len) {
                                            var n = et.getStream(r.fd);
                                            n && (2 & r.prot && tt.doMsync(e, n, t, r.flags, r.offset), et.munmap(n)), (tt.mappings[e] = null), r.allocated && er(r.malloc);
                                        }
                                        return 0;
                                    }
                                    function yt(e, t) {
                                        try {
                                            return vt(e, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function bt(e, t, r) {
                                        tt.varargs = r;
                                        try {
                                            var n = tt.getStr(e),
                                                o = r ? tt.get() : 0;
                                            return et.open(n, t, o).fd;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function wt(e, t, r) {
                                        try {
                                            return (e = tt.getStr(e)), tt.doReadlink(e, t, r);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function Et(e) {
                                        try {
                                            return (e = tt.getStr(e)), et.rmdir(e), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function kt(e, t) {
                                        try {
                                            return (e = tt.getStr(e)), tt.doStat(et.stat, e, t);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function St(e) {
                                        try {
                                            return (e = tt.getStr(e)), et.unlink(e), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), -e.errno;
                                        }
                                    }
                                    function qt() {
                                        return 2147483648;
                                    }
                                    function xt(e, t, r) {
                                        G.copyWithin(e, t, t + r);
                                    }
                                    function Dt(e) {
                                        try {
                                            return M.grow((e - W.byteLength + 65535) >>> 16), le(M.buffer), 1;
                                        } catch (e) {}
                                    }
                                    function Ft(e) {
                                        var t = G.length,
                                            r = 2147483648;
                                        if ((e >>>= 0) > r) return !1;
                                        for (var n = 1; n <= 4; n *= 2) {
                                            var o = t * (1 + 0.2 / n);
                                            if (((o = Math.min(o, e + 100663296)), Dt(Math.min(r, ue(Math.max(e, o), 65536))))) return !0;
                                        }
                                        return !1;
                                    }
                                    function Mt(e) {
                                        for (var t = Je(); Je() - t < e; );
                                    }
                                    Je = h
                                        ? function () {
                                            var e = process.hrtime();
                                            return 1e3 * e[0] + e[1] / 1e6;
                                        }
                                        : "undefined" != typeof dateNow
                                            ? dateNow
                                            : function () {
                                                return performance.now();
                                            };
                                    var Pt = {};
                                    function At() {
                                        return c || "./this.program";
                                    }
                                    function Rt() {
                                        if (!Rt.strings) {
                                            var e = {
                                                USER: "web_user",
                                                LOGNAME: "web_user",
                                                PATH: "/",
                                                PWD: "/",
                                                HOME: "/home/web_user",
                                                LANG: (("object" == typeof navigator && navigator.languages && navigator.languages[0]) || "C").replace("-", "_") + ".UTF-8",
                                                _: At(),
                                            };
                                            for (var t in Pt) e[t] = Pt[t];
                                            var r = [];
                                            for (var t in e) r.push(t + "=" + e[t]);
                                            Rt.strings = r;
                                        }
                                        return Rt.strings;
                                    }
                                    function zt(e, t) {
                                        try {
                                            var r = 0;
                                            return (
                                                Rt().forEach(function (n, o) {
                                                    var i = t + r;
                                                    (K[(e + 4 * o) >> 2] = i), ae(n, i), (r += n.length + 1);
                                                }),
                                                    0
                                            );
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Ot(e, t) {
                                        try {
                                            var r = Rt();
                                            K[e >> 2] = r.length;
                                            var n = 0;
                                            return (
                                                r.forEach(function (e) {
                                                    n += e.length + 1;
                                                }),
                                                    (K[t >> 2] = n),
                                                    0
                                            );
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function jt(e) {
                                        try {
                                            var t = tt.getStreamFromFD(e);
                                            return et.close(t), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Ct(e, t) {
                                        try {
                                            var r = tt.getStreamFromFD(e),
                                                n = r.tty ? 2 : et.isDir(r.mode) ? 3 : et.isLink(r.mode) ? 7 : 4;
                                            return (X[t >> 0] = n), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Tt(e, t, r, n) {
                                        try {
                                            var o = tt.getStreamFromFD(e),
                                                i = tt.doReadv(o, t, r);
                                            return (K[n >> 2] = i), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Bt(e, t, r, n, o) {
                                        try {
                                            var i = tt.getStreamFromFD(e),
                                                s = 4294967296 * r + (t >>> 0),
                                                a = 9007199254740992;
                                            return s <= -a || s >= a
                                                ? -61
                                                : (et.llseek(i, s, n),
                                                    (Oe = [
                                                        i.position >>> 0,
                                                        ((ze = i.position), +Math.abs(ze) >= 1 ? (ze > 0 ? (0 | Math.min(+Math.floor(ze / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ze - +(~~ze >>> 0)) / 4294967296) >>> 0) : 0),
                                                    ]),
                                                    (K[o >> 2] = Oe[0]),
                                                    (K[(o + 4) >> 2] = Oe[1]),
                                                i.getdents && 0 === s && 0 === n && (i.getdents = null),
                                                    0);
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Lt(e) {
                                        try {
                                            var t = tt.getStreamFromFD(e);
                                            return t.stream_ops && t.stream_ops.fsync ? -t.stream_ops.fsync(t) : 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Nt(e, t, r, n) {
                                        try {
                                            var o = tt.getStreamFromFD(e),
                                                i = tt.doWritev(o, t, r);
                                            return (K[n >> 2] = i), 0;
                                        } catch (e) {
                                            return (void 0 !== et && e instanceof et.ErrnoError) || De(e), e.errno;
                                        }
                                    }
                                    function Ht(e) {
                                        var t = Date.now();
                                        return (K[e >> 2] = (t / 1e3) | 0), (K[(e + 4) >> 2] = ((t % 1e3) * 1e3) | 0), 0;
                                    }
                                    function It(e) {
                                        var t = (Date.now() / 1e3) | 0;
                                        return e && (K[e >> 2] = t), t;
                                    }
                                    function Ut(e, t) {
                                        e = ee(e);
                                        try {
                                            return et.utime(e, t, t), 0;
                                        } catch (e) {
                                            if (!(e instanceof et.ErrnoError)) throw e + " : " + Ie();
                                            return at(e.errno), -1;
                                        }
                                    }
                                    function Vt(e, t) {
                                        var r;
                                        if (t) {
                                            var n = t + 8;
                                            (r = 1e3 * K[n >> 2]), (r += K[(n + 4) >> 2] / 1e3);
                                        } else r = Date.now();
                                        return Ut(e, r);
                                    }
                                    var Wt = function (e, t, r, n) {
                                            e || (e = this),
                                                (this.parent = e),
                                                (this.mount = e.mount),
                                                (this.mounted = null),
                                                (this.id = et.nextInode++),
                                                (this.name = t),
                                                (this.mode = r),
                                                (this.node_ops = {}),
                                                (this.stream_ops = {}),
                                                (this.rdev = n);
                                        },
                                        Xt = 365,
                                        Gt = 146;
                                    function $t(e, t, r) {
                                        var n = r > 0 ? r : ne(e) + 1,
                                            o = new Array(n),
                                            i = te(e, o, 0, o.length);
                                        return t && (o.length = i), o;
                                    }
                                    Object.defineProperties(Wt.prototype, {
                                        read: {
                                            get: function () {
                                                return (this.mode & Xt) === Xt;
                                            },
                                            set: function (e) {
                                                e ? (this.mode |= Xt) : (this.mode &= ~Xt);
                                            },
                                        },
                                        write: {
                                            get: function () {
                                                return (this.mode & Gt) === Gt;
                                            },
                                            set: function (e) {
                                                e ? (this.mode |= Gt) : (this.mode &= ~Gt);
                                            },
                                        },
                                        isFolder: {
                                            get: function () {
                                                return et.isDir(this.mode);
                                            },
                                        },
                                        isDevice: {
                                            get: function () {
                                                return et.isChrdev(this.mode);
                                            },
                                        },
                                    }),
                                        (et.FSNode = Wt),
                                        et.staticInit();
                                    var Kt,
                                        Yt = {
                                            a: Ue,
                                            t: Xe,
                                            E: rt,
                                            z: nt,
                                            F: ot,
                                            A: it,
                                            G: st,
                                            b: ut,
                                            y: lt,
                                            m: ct,
                                            J: ft,
                                            l: dt,
                                            d: ht,
                                            w: pt,
                                            x: mt,
                                            C: gt,
                                            D: yt,
                                            v: bt,
                                            h: wt,
                                            H: Et,
                                            e: kt,
                                            j: St,
                                            u: qt,
                                            o: xt,
                                            c: Ft,
                                            s: Mt,
                                            q: zt,
                                            r: Ot,
                                            f: jt,
                                            p: Ct,
                                            i: Tt,
                                            n: Bt,
                                            I: Lt,
                                            k: Nt,
                                            g: Ht,
                                            K: It,
                                            B: Vt,
                                        },
                                        Qt =
                                            (Be(),
                                                (i.___wasm_call_ctors = function () {
                                                    return (i.___wasm_call_ctors = i.asm.M).apply(null, arguments);
                                                }),
                                                (i._memset = function () {
                                                    return (Qt = i._memset = i.asm.N).apply(null, arguments);
                                                })),
                                        Jt =
                                            ((i._sqlite3_malloc = function () {
                                                return (i._sqlite3_malloc = i.asm.O).apply(null, arguments);
                                            }),
                                                (i._sqlite3_free = function () {
                                                    return (i._sqlite3_free = i.asm.P).apply(null, arguments);
                                                }),
                                                (i.___errno_location = function () {
                                                    return (Jt = i.___errno_location = i.asm.Q).apply(null, arguments);
                                                })),
                                        Zt =
                                            ((i._sqlite3_finalize = function () {
                                                return (i._sqlite3_finalize = i.asm.R).apply(null, arguments);
                                            }),
                                                (i._sqlite3_reset = function () {
                                                    return (i._sqlite3_reset = i.asm.S).apply(null, arguments);
                                                }),
                                                (i._sqlite3_clear_bindings = function () {
                                                    return (i._sqlite3_clear_bindings = i.asm.T).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_blob = function () {
                                                    return (i._sqlite3_value_blob = i.asm.U).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_text = function () {
                                                    return (i._sqlite3_value_text = i.asm.V).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_bytes = function () {
                                                    return (i._sqlite3_value_bytes = i.asm.W).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_double = function () {
                                                    return (i._sqlite3_value_double = i.asm.X).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_int = function () {
                                                    return (i._sqlite3_value_int = i.asm.Y).apply(null, arguments);
                                                }),
                                                (i._sqlite3_value_type = function () {
                                                    return (i._sqlite3_value_type = i.asm.Z).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_blob = function () {
                                                    return (i._sqlite3_result_blob = i.asm._).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_double = function () {
                                                    return (i._sqlite3_result_double = i.asm.$).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_error = function () {
                                                    return (i._sqlite3_result_error = i.asm.aa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_int = function () {
                                                    return (i._sqlite3_result_int = i.asm.ba).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_int64 = function () {
                                                    return (i._sqlite3_result_int64 = i.asm.ca).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_null = function () {
                                                    return (i._sqlite3_result_null = i.asm.da).apply(null, arguments);
                                                }),
                                                (i._sqlite3_result_text = function () {
                                                    return (i._sqlite3_result_text = i.asm.ea).apply(null, arguments);
                                                }),
                                                (i._sqlite3_step = function () {
                                                    return (i._sqlite3_step = i.asm.fa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_count = function () {
                                                    return (i._sqlite3_column_count = i.asm.ga).apply(null, arguments);
                                                }),
                                                (i._sqlite3_data_count = function () {
                                                    return (i._sqlite3_data_count = i.asm.ha).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_blob = function () {
                                                    return (i._sqlite3_column_blob = i.asm.ia).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_bytes = function () {
                                                    return (i._sqlite3_column_bytes = i.asm.ja).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_double = function () {
                                                    return (i._sqlite3_column_double = i.asm.ka).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_text = function () {
                                                    return (i._sqlite3_column_text = i.asm.la).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_type = function () {
                                                    return (i._sqlite3_column_type = i.asm.ma).apply(null, arguments);
                                                }),
                                                (i._sqlite3_column_name = function () {
                                                    return (i._sqlite3_column_name = i.asm.na).apply(null, arguments);
                                                }),
                                                (i._sqlite3_bind_blob = function () {
                                                    return (i._sqlite3_bind_blob = i.asm.oa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_bind_double = function () {
                                                    return (i._sqlite3_bind_double = i.asm.pa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_bind_int = function () {
                                                    return (i._sqlite3_bind_int = i.asm.qa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_bind_text = function () {
                                                    return (i._sqlite3_bind_text = i.asm.ra).apply(null, arguments);
                                                }),
                                                (i._sqlite3_bind_parameter_index = function () {
                                                    return (i._sqlite3_bind_parameter_index = i.asm.sa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_sql = function () {
                                                    return (i._sqlite3_sql = i.asm.ta).apply(null, arguments);
                                                }),
                                                (i._sqlite3_normalized_sql = function () {
                                                    return (i._sqlite3_normalized_sql = i.asm.ua).apply(null, arguments);
                                                }),
                                                (i._sqlite3_errmsg = function () {
                                                    return (i._sqlite3_errmsg = i.asm.va).apply(null, arguments);
                                                }),
                                                (i._sqlite3_exec = function () {
                                                    return (i._sqlite3_exec = i.asm.wa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_prepare_v2 = function () {
                                                    return (i._sqlite3_prepare_v2 = i.asm.xa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_create_module_v2 = function () {
                                                    return (i._sqlite3_create_module_v2 = i.asm.ya).apply(null, arguments);
                                                }),
                                                (i._sqlite3_declare_vtab = function () {
                                                    return (i._sqlite3_declare_vtab = i.asm.za).apply(null, arguments);
                                                }),
                                                (i._sqlite3_changes = function () {
                                                    return (i._sqlite3_changes = i.asm.Aa).apply(null, arguments);
                                                }),
                                                (i._sqlite3_close_v2 = function () {
                                                    return (i._sqlite3_close_v2 = i.asm.Ba).apply(null, arguments);
                                                }),
                                                (i._sqlite3_create_function_v2 = function () {
                                                    return (i._sqlite3_create_function_v2 = i.asm.Ca).apply(null, arguments);
                                                }),
                                                (i._sqlite3_open = function () {
                                                    return (i._sqlite3_open = i.asm.Da).apply(null, arguments);
                                                }),
                                                (i._malloc = function () {
                                                    return (Zt = i._malloc = i.asm.Ea).apply(null, arguments);
                                                })),
                                        er = (i._free = function () {
                                            return (er = i._free = i.asm.Fa).apply(null, arguments);
                                        }),
                                        tr =
                                            ((i._RegisterExtensionFunctions = function () {
                                                return (i._RegisterExtensionFunctions = i.asm.Ha).apply(null, arguments);
                                            }),
                                                (i.__get_tzname = function () {
                                                    return (tr = i.__get_tzname = i.asm.Ia).apply(null, arguments);
                                                })),
                                        rr = (i.__get_daylight = function () {
                                            return (rr = i.__get_daylight = i.asm.Ja).apply(null, arguments);
                                        }),
                                        nr = (i.__get_timezone = function () {
                                            return (nr = i.__get_timezone = i.asm.Ka).apply(null, arguments);
                                        }),
                                        or = (i.stackSave = function () {
                                            return (or = i.stackSave = i.asm.La).apply(null, arguments);
                                        }),
                                        ir = (i.stackRestore = function () {
                                            return (ir = i.stackRestore = i.asm.Ma).apply(null, arguments);
                                        }),
                                        sr = (i.stackAlloc = function () {
                                            return (sr = i.stackAlloc = i.asm.Na).apply(null, arguments);
                                        }),
                                        ar = (i._memalign = function () {
                                            return (ar = i._memalign = i.asm.Oa).apply(null, arguments);
                                        });
                                    function ur(e) {
                                        function t() {
                                            Kt || ((Kt = !0), (i.calledRun = !0), T || (_e(), ge(), i.onRuntimeInitialized && i.onRuntimeInitialized(), ve()));
                                        }
                                        (e = e || l),
                                        Ee > 0 ||
                                        (me(),
                                        Ee > 0 ||
                                        (i.setStatus
                                            ? (i.setStatus("Running..."),
                                                setTimeout(function () {
                                                    setTimeout(function () {
                                                        i.setStatus("");
                                                    }, 1),
                                                        t();
                                                }, 1))
                                            : t()));
                                    }
                                    if (
                                        ((i.ccall = N),
                                            (i.cwrap = H),
                                            (i.setValue = j),
                                            (i.getValue = C),
                                            (i.UTF8ToString = ee),
                                            (i.stringToUTF8 = re),
                                            (i.lengthBytesUTF8 = ne),
                                            (i.addFunction = O),
                                            (i.stackSave = or),
                                            (i.stackRestore = ir),
                                            (i.stackAlloc = sr),
                                            (Se = function e() {
                                                Kt || ur(), Kt || (Se = e);
                                            }),
                                            (i.run = ur),
                                            i.preInit)
                                    )
                                        for ("function" == typeof i.preInit && (i.preInit = [i.preInit]); i.preInit.length > 0; ) i.preInit.pop()();
                                    return ur(), i;
                                }))
                            );
                        };
                    (e.exports = o), (e.exports.default = o);
                },
                720: (e, t, r) => {
                    "use strict";
                    e.exports = r.p + "sql-wasm.wasm";
                },
                821: () => {},
                905: () => {},
                101: () => {},
            },
            __webpack_module_cache__ = {};
        function __webpack_require__(e) {
            var t = __webpack_module_cache__[e];
            if (void 0 !== t) return t.exports;
            var r = (__webpack_module_cache__[e] = { id: e, loaded: !1, exports: {} });
            return __webpack_modules__[e].call(r.exports, r, r.exports, __webpack_require__), (r.loaded = !0), r.exports;
        }
        (__webpack_require__.d = (e, t) => {
            for (var r in t) __webpack_require__.o(t, r) && !__webpack_require__.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
        }),
            (__webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
            (__webpack_require__.r = (e) => {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
            }),
            (__webpack_require__.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e)),
            (__webpack_require__.p = "");
        var __webpack_exports__ = __webpack_require__(630);
        return __webpack_exports__;
    })();
});
//# sourceMappingURL=sqlite.worker.js.map
