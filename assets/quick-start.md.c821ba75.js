import{d as u}from"./chunks/index.da74b5da.js";import{r,o as A,a as h,b as t,c,e as n,t as i,f as y,g as o}from"./app.7feb3f77.js";const g=o(`<h1 id="quick-start" tabindex="-1">Quick Start <a class="header-anchor" href="#quick-start" aria-hidden="true">#</a></h1><h2 id="basic-setup" tabindex="-1">Basic Setup <a class="header-anchor" href="#basic-setup" aria-hidden="true">#</a></h2><p>Depending on your use case, you can use different kinds of providers:</p><ul><li><p><strong>Extension only:</strong></p><p>This default usage pattern requires injected provider object. This means extension must be installed or website is opened inside some webview with prepared runtime. Library will wait until this object is ready and will not require any other assets to load.</p><div class="language-sh"><pre><code><span class="line"><span style="color:var(--vp-c-brand);">&gt;</span> <span style="color:#A6ACCD;">npm install --save everscale-inpage-provider</span></span></code></pre></div><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ProviderRpcClient</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">everscale-inpage-provider</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> ever </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ProviderRpcClient</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div></li><li><p><strong>With <code>everscale-standalone-client</code>:</strong></p><p>In case your app doesn&#39;t require user interaction, it can use some kind of fallback provider. Depending on <code>forceUseFallback</code> parameter it will either always use fallback or only when injected rpc object was not found.</p><p>In browser environment it will load additional <code>wasm</code> file (<strong>~1.3MB</strong>), so make sure to enable compression or be aware of your app startup time.</p><div class="language-sh"><pre><code><span class="line"><span style="color:var(--vp-c-brand);">&gt;</span> <span style="color:#A6ACCD;">npm install --save everscale-inpage-provider everscale-standalone-client</span></span></code></pre></div><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ProviderRpcClient</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">everscale-inpage-provider</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">EverscaleStandaloneClient</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">everscale-standalone-client</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> ever </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ProviderRpcClient</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// You can pass \`false\` to still use extension if it is installed</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">forceUseFallback</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// This method will be executed if either extension</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// was not found or \`forceUseFallback\` is \`true\`</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#82AAFF;">fallback</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">async</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    EverscaleStandaloneClient</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">create</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">      </span><span style="color:#676E95;">// You can specify either connection options or preset name</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#F07178;">connection</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;">// network id</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">type</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">graphql</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#F07178;">data</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">          </span><span style="color:#676E95;">// create your own project at https://dashboard.evercloud.dev</span></span>
<span class="line"><span style="color:#A6ACCD;">          </span><span style="color:#F07178;">endpoints</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://devnet-sandbox.evercloud.dev/graphql</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">      </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>In <strong>NodeJS</strong> environment you should import from <code>everscale-standalone-client/nodejs</code> instead. It will not be initialized correctly otherwise.</p></div></li></ul><p>Right after provider is initialized its state can be retrieved:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> currentProviderState </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getProviderState</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,6),v={class:"demo"},b={key:0},m=o(`<blockquote><p>You need to install an extension to be able to play with the demos.</p></blockquote><h2 id="permissions" tabindex="-1">Permissions <a class="header-anchor" href="#permissions" aria-hidden="true">#</a></h2><p>Each RPC method requires some set of permissions to be executed. Therefore, the website must request a required subset of them to be able to execute these methods. Each permission can have some data assigned to it.</p><p>At the moment there are only two permissions:</p><ul><li><code>basic</code> - needed for all simple methods like calculating account address or getting transactions. This permission doesn&#39;t have any data assigned to it.</li><li><code>accountInteraction</code> - any request which requires user interaction (e.g. through popup) requires this permission.<div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Assigned data:</span></span>
<span class="line"><span style="color:#C792EA;">type</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">AccountInteractionData</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// Address of the selected wallet</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">address</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Address</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// Preferred public key (usually a public key from the selected wallet)</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">publicKey</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// Hint about wallet contract type</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">contractType</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">WalletContractType</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span></code></pre></div></li></ul><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// You can subscribe to permission changes in one place</span></span>
<span class="line"><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">subscribe</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">permissionsChanged</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">))</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">data</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">permissions</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#89DDFF;">  </span><span style="color:#676E95;">// You can update component state here</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">permissions</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// NOTE: subscription object can be used during the disposal:</span></span>
<span class="line"><span style="color:#676E95;">//   const subscription = await ever.subscribe(&#39;permissionsChanged&#39;);</span></span>
<span class="line"><span style="color:#676E95;">//   subscription.on(&#39;data&#39;, data =&gt; { ... });</span></span>
<span class="line"><span style="color:#676E95;">//   ...</span></span>
<span class="line"><span style="color:#676E95;">//   await subscription.unsubscribe();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// Request all permissions</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> permissions </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">requestPermissions</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">permissions</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">basic</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">accountInteraction</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// Log out and disable all permissions</span></span>
<span class="line"><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">disconnect</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You don&#39;t need to request permissions while using standalone client with NodeJS. <code>requestPermissions</code> will not give errors, but it will not do anything either.</p></div>`,7),w={class:"demo"},f={key:0},_=o('<blockquote><p>NOTE: You can check current provider state using <code>getProviderState</code> demo.</p></blockquote><h2 id="changing-account" tabindex="-1">Changing account <a class="header-anchor" href="#changing-account" aria-hidden="true">#</a></h2><p>Quite often there may be a situation in which the user works with your app through several accounts. In order to change your account, you can either simply log out and log in, but then all subscriptions will be reset. Therefore, to change the account there is a separate method that is preferable to use:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// It will trigger `permissionsChanged` event, where `accountInteraction`</span></span>\n<span class="line"><span style="color:#676E95;">// will contain the selected account</span></span>\n<span class="line"><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">changeAccount</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>\n<span class="line"></span></code></pre></div>',4),E=o(`<blockquote><p>NOTE: <code>changeAccount</code> requires <code>accountInteraction</code> permissions</p></blockquote><h2 id="other-stuff" tabindex="-1">Other Stuff <a class="header-anchor" href="#other-stuff" aria-hidden="true">#</a></h2><ul><li><p>In some cases, it is necessary to determine whether the page has a provider as an extension:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">hasEverscaleProvider</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">everscale-inpage-provider</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;">// Will always return \`false\` in Web Workers or NodeJS environment,</span></span>
<span class="line"><span style="color:#676E95;">// otherwise it will wait until the page is loaded and check</span></span>
<span class="line"><span style="color:#676E95;">// whether the RPC object is injected</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> hasProvider </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">hasEverscaleProvider</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div></li><li><p>You can explicitly wait until provider is fully initialized:</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Will either throw an exception if there are some probles,</span></span>
<span class="line"><span style="color:#676E95;">// or wait until extension/fallback initialization promise is resolved</span></span>
<span class="line"><span style="color:#89DDFF;">await</span><span style="color:#A6ACCD;"> ever</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">ensureInitialized</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div></li><li><p>There are several lifecycle events to provide better error messages or state info:</p><ul><li><code>connected</code> - Called every time when provider connection is established.</li><li><code>disconnected</code> - Called when inpage provider disconnects from extension.</li><li><code>networkChanged</code> - Called each time the user changes network.</li><li><code>permissionsChanged</code> - Called when permissions are changed.</li><li><code>loggedOut</code> - Called when the user logs out of the extension (completely).</li></ul></li></ul><h2 id="what-s-next" tabindex="-1">What&#39;s next? <a class="header-anchor" href="#what-s-next" aria-hidden="true">#</a></h2><p>At this point, you should have understood roughly the basic structure of a provider. However, we have not yet interacted with the blockchain in any way! Let&#39;s fix it in the next sections, in which we will cover all popular use cases.</p>`,5),P=JSON.parse(`{"title":"Quick Start","description":"","frontmatter":{},"headers":[{"level":2,"title":"Basic Setup","slug":"basic-setup","link":"#basic-setup","children":[]},{"level":2,"title":"Permissions","slug":"permissions","link":"#permissions","children":[]},{"level":2,"title":"Changing account","slug":"changing-account","link":"#changing-account","children":[]},{"level":2,"title":"Other Stuff","slug":"other-stuff","link":"#other-stuff","children":[]},{"level":2,"title":"What's next?","slug":"what-s-next","link":"#what-s-next","children":[]}],"relativePath":"quick-start.md","lastUpdated":1669740834000}`),k={name:"quick-start.md"},I=Object.assign(k,{setup(q){const a=new u.ProviderRpcClient,l=r(),D=async()=>{await a.ensureInitialized(),l.value=await a.rawApi.getProviderState().then(s=>JSON.stringify(s,void 0,4))},p=r();let e;A(async()=>{e=await a.subscribe("permissionsChanged"),e.on("data",s=>{s.permissions.accountInteraction!=null&&(s.permissions.accountInteraction.address=s.permissions.accountInteraction.address.toString()),p.value=JSON.stringify(s,void 0,4)})}),h(async()=>{e!=null&&e.unsubscribe()});const d=async()=>{await a.requestPermissions({permissions:["basic","accountInteraction"]})},F=async()=>{await a.disconnect()},C=async()=>{await a.changeAccount()};return(s,S)=>(t(),c("div",null,[g,n("div",v,[n("button",{onClick:D},"Get provider state"),l.value!=null?(t(),c("pre",b,i(l.value),1)):y("",!0)]),m,n("div",w,[n("button",{onClick:d},"Request permissions"),n("button",{onClick:F},"Log Out"),p.value!=null?(t(),c("pre",f,i(p.value),1)):y("",!0)]),_,n("div",{class:"demo"},[n("button",{onClick:C},"Change account")]),E]))}});export{P as __pageData,I as default};
