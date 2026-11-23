import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { categories, money, products } from "./data";

const readStore = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function App() {
  const [cart, setCart] = useState(() => readStore("gl-cart", []));
  const [wishlist, setWishlist] = useState(() => readStore("gl-wishlist", []));
  const [orders, setOrders] = useState(() => readStore("gl-orders", []));
  const [user, setUser] = useState(() => readStore("gl-user", null));
  const [toast, setToast] = useState("");

  useEffect(() => writeStore("gl-cart", cart), [cart]);
  useEffect(() => writeStore("gl-wishlist", wishlist), [wishlist]);
  useEffect(() => writeStore("gl-orders", orders), [orders]);
  useEffect(() => writeStore("gl-user", user), [user]);

  const notify = (message) => { setToast(message); window.clearTimeout(window.__glToast); window.__glToast = window.setTimeout(() => setToast(""), 2400); };
  const addToCart = (product, qty = 1) => {
    setCart(old => {
      const found = old.find(item => item.id === product.id);
      return found ? old.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item) : [...old, { ...product, qty }];
    });
    notify(`${product.name} added to your bag`);
  };
  const changeQty = (id, qty) => setCart(old => qty < 1 ? old.filter(x => x.id !== id) : old.map(x => x.id === id ? { ...x, qty } : x));
  const toggleWishlist = (product) => {
    const exists = wishlist.some(x => x.id === product.id);
    setWishlist(old => exists ? old.filter(x => x.id !== product.id) : [...old, product]);
    notify(exists ? "Removed from wishlist" : "Saved to your wishlist");
  };
  const logout = () => { setUser(null); notify("You have been signed out"); };

  return <>
    <Announcement />
    <Header cartCount={cart.reduce((n, x) => n + x.qty, 0)} wishlistCount={wishlist.length} user={user} />
    <Routes>
      <Route path="/" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
      <Route path="/shop" element={<Shop addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
      <Route path="/category/:category" element={<Shop addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
      <Route path="/product/:id" element={<ProductPage addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
      <Route path="/wishlist" element={<Wishlist items={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />} />
      <Route path="/cart" element={<Cart items={cart} changeQty={changeQty} />} />
      <Route path="/checkout" element={<Checkout items={cart} setCart={setCart} orders={orders} setOrders={setOrders} user={user} notify={notify} />} />
      <Route path="/account" element={<Account user={user} setUser={setUser} notify={notify} />} />
      <Route path="/track-order" element={<TrackOrder orders={orders} />} />
      <Route path="/admin" element={<Admin orders={orders} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    {toast && <div className="toast-message"><i className="bi bi-check-circle-fill me-2"></i>{toast}</div>}
  </>;
}

function Announcement() {
  return <div className="announcement">A greener home starts here <span>✦</span> Thoughtfully packed, delivered with care</div>;
}
function Header({ cartCount, wishlistCount, user }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header sticky-top">
    <nav className="navbar navbar-expand-lg container py-3">
      <Link className="brand" to="/"><span className="brand-mark"><i className="bi bi-flower1"></i></span><span>greenleaf<small>PLANTS • LIVING • GROWING</small></span></Link>
      <button className="navbar-toggler" onClick={() => setOpen(!open)} aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
      <div className={`navbar-collapse ${open ? "show" : ""}`}>
        <div className="navbar-nav mx-auto main-nav">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setOpen(false)}>Shop all</NavLink>
          <div className="nav-dropdown">
            <button onClick={() => setOpen(!open)}>Collections <i className="bi bi-chevron-down"></i></button>
            <div className="dropdown-panel">
              {categories.map(c => <Link key={c.name} to={`/category/${encodeURIComponent(c.name)}`}>{c.name}</Link>)}
            </div>
          </div>
          <a href="/#story" onClick={() => setOpen(false)}>Our story</a>
          <Link to="/track-order" onClick={() => setOpen(false)}>Track order</Link>
        </div>
        <div className="header-actions">
          <Link to="/account" aria-label="Account" title={user?.name || "Account"}><i className="bi bi-person"></i></Link>
          <Link to="/wishlist" aria-label="Wishlist" className="icon-with-count"><i className="bi bi-heart"></i>{wishlistCount > 0 && <b>{wishlistCount}</b>}</Link>
          <Link to="/cart" aria-label="Shopping bag" className="icon-with-count"><i className="bi bi-bag"></i><b>{cartCount}</b></Link>
        </div>
      </div>
    </nav>
  </header>;
}

function Home({ addToCart, toggleWishlist, wishlist }) {
  const featured = products.slice(0, 4);
  return <main>
    <section className="hero-section">
      <div className="hero-image"></div>
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow light">A LITTLE MORE NATURE, EVERY DAY</span>
          <h1>Make space<br/>for <em>something</em><br/>beautiful.</h1>
          <p>Thoughtfully chosen plants and pieces to make your everyday spaces feel more alive.</p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-cream">Explore the collection <i className="bi bi-arrow-up-right ms-2"></i></Link>
            <a href="#categories" className="hero-text-link">Find your plant <i className="bi bi-arrow-down"></i></a>
          </div>
        </div>
        <div className="hero-note"><span>01 / 03</span><span>GROW A HOME YOU LOVE</span></div>
      </div>
    </section>

    <section className="service-strip container">
      <div><i className="bi bi-box-seam"></i><span><b>Carefully packed</b><small>Safe plant journeys</small></span></div>
      <div><i className="bi bi-patch-check"></i><span><b>Healthy selections</b><small>Chosen with care</small></span></div>
      <div><i className="bi bi-chat-heart"></i><span><b>Plant care support</b><small>Here when you need us</small></span></div>
      <div><i className="bi bi-leaf"></i><span><b>Grow with confidence</b><small>Simple care guidance</small></span></div>
    </section>

    <section className="section-space container" id="categories">
      <SectionHeading kicker="A PLACE TO BEGIN" title="Find your kind of green" text="From leafy corners to little gifts, there is a plant for every space." />
      <div className="category-grid">
        {categories.map((c, i) => <Link to={`/category/${encodeURIComponent(c.name)}`} className={`category-tile tile-${i}`} key={c.name}>
          <img src={c.image} alt={c.name} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/><div className="category-overlay"><span>{c.subtitle}</span><h3>{c.name}</h3><b>Explore <i className="bi bi-arrow-up-right"></i></b></div>
        </Link>)}
      </div>
    </section>

    <section className="section-space soft-section">
      <div className="container">
        <div className="section-topline"><SectionHeading kicker="THE GREENLEAF EDIT" title="Loved by plant people" text="A few favourites that are ready to find a new home." /><Link to="/shop" className="under-link">Shop all plants <i className="bi bi-arrow-up-right"></i></Link></div>
        <ProductGrid items={featured} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist}/>
      </div>
    </section>

    <section className="story-section container" id="story">
      <div className="story-photo"><img src="/images/hero-real-plants.png" alt="Sunlit green plants" loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/><span className="photo-stamp">GROW<br/>SLOW</span></div>
      <div className="story-copy"><span className="eyebrow">ROOTED IN THE EVERYDAY</span><h2>More than plants.<br/><em>A feeling of home.</em></h2><p>We believe a little greenery can change the way a room feels — and the way a day begins. GreenLeaf brings together considered plants, useful essentials and friendly guidance for every stage of your growing journey.</p><Link to="/shop" className="btn btn-forest">Get to know your next plant <i className="bi bi-arrow-up-right ms-2"></i></Link></div>
    </section>

    <section className="care-banner">
      <div className="container care-inner"><div><span className="eyebrow light">A NOTE FOR NEW PLANT PARENTS</span><h2>Not sure where to start?</h2><p>Choose an easy-care favourite and let the growing begin.</p><Link to="/category/Indoor%20Plants" className="btn btn-cream">Explore easy-care plants</Link></div><img src="/images/hero-real-plants.png" alt="Lush green plant" loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/></div>
    </section>
  </main>;
}

function SectionHeading({ kicker, title, text }) {
  return <div className="section-heading"><span className="eyebrow">{kicker}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function ProductGrid({ items, addToCart, toggleWishlist, wishlist }) {
  if (!items.length) return <div className="empty-state"><i className="bi bi-flower2"></i><h3>No plants found</h3><p>Try changing your filters or search term.</p></div>;
  return <div className="row g-4">{items.map(p => <div className="col-6 col-lg-3" key={p.id}><ProductCard product={p} addToCart={addToCart} toggleWishlist={toggleWishlist} wished={wishlist.some(x => x.id === p.id)}/></div>)}</div>;
}
function ProductCard({ product, addToCart, toggleWishlist, wished }) {
  return <article className="product-card">
    <div className="product-card-image"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`wish-btn ${wished ? "wished" : ""}`} onClick={() => toggleWishlist(product)} aria-label="Toggle wishlist"><i className={`bi ${wished ? "bi-heart-fill" : "bi-heart"}`}></i></button><button className="quick-add" onClick={() => addToCart(product)}><i className="bi bi-plus-lg"></i> Quick add</button></div>
    <div className="product-card-info"><div className="product-category">{product.category}</div><Link to={`/product/${product.id}`} className="product-name">{product.name}</Link><div className="rating-line"><span>★ {product.rating}</span><small>({product.reviews} reviews)</small></div><div className="product-price">{money(product.price)} {product.oldPrice && <del>{money(product.oldPrice)}</del>}</div></div>
  </article>;
}

function Shop({ addToCart, toggleWishlist, wishlist }) {
  const { category: routeCategory } = useParams();
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") || "");
  const [selected, setSelected] = useState(routeCategory ? decodeURIComponent(routeCategory) : "All collections");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [inStock, setInStock] = useState(false);
  useEffect(() => setSelected(routeCategory ? decodeURIComponent(routeCategory) : "All collections"), [routeCategory]);
  const filtered = useMemo(() => {
    let result = products.filter(p => (selected === "All collections" || p.category === selected) && p.name.toLowerCase().includes(search.toLowerCase()) && p.price <= maxPrice && (!inStock || p.stock > 0));
    if (sort === "low") result = [...result].sort((a,b) => a.price-b.price);
    if (sort === "high") result = [...result].sort((a,b) => b.price-a.price);
    if (sort === "rating") result = [...result].sort((a,b) => b.rating-a.rating);
    return result;
  }, [selected, search, sort, maxPrice, inStock]);
  return <main className="container page-space">
    <div className="shop-intro"><div><span className="eyebrow">THE GREENLEAF SHOP</span><h1>{selected === "All collections" ? "Plants & good things" : selected}</h1><p>Find something lovely for your space, your garden or someone you love.</p></div><div className="breadcrumb-lite"><Link to="/">Home</Link> / Shop</div></div>
    <div className="shop-toolbar"><span>{filtered.length} thoughtfully chosen products</span><div className="toolbar-controls"><div className="search-control"><i className="bi bi-search"></i><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plants..."/></div><select className="form-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="rating">Top rated</option></select></div></div>
    <div className="shop-layout">
      <aside className="filter-sidebar"><h5>Shop by category</h5>{["All collections", ...categories.map(c => c.name)].map(c => <button key={c} className={selected === c ? "filter-active" : ""} onClick={() => setSelected(c)}>{c}<i className="bi bi-chevron-right"></i></button>)}<hr/><h5>Price range</h5><p className="filter-price">Up to {money(maxPrice)}</p><input type="range" min="100" max="1500" step="50" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="form-range"/><hr/><label className="stock-check"><input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/> In stock only</label><button className="clear-filters" onClick={() => {setSelected("All collections");setSearch("");setSort("featured");setMaxPrice(1500);setInStock(false);}}>Clear filters</button></aside>
      <div className="shop-products"><ProductGrid items={filtered} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist}/></div>
    </div>
  </main>;
}

function ProductPage({ addToCart, toggleWishlist, wishlist }) {
  const { id } = useParams(); const product = products.find(p => p.id === id); const [qty, setQty] = useState(1);
  if (!product) return <NotFound/>;
  const wished = wishlist.some(x => x.id === product.id);
  return <main className="container page-space"><div className="breadcrumb-lite mb-4"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.name}</div><div className="row g-5 product-detail"><div className="col-lg-6"><div className="detail-image"><img src={product.image} alt={product.name} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/></div></div><div className="col-lg-6 detail-copy"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><div className="rating-line mb-3"><span>★ {product.rating}</span><small>{product.reviews} customer reviews</small></div><div className="detail-price">{money(product.price)} <del>{money(product.oldPrice)}</del></div><p className="detail-description">{product.description}</p><div className="stock-note"><i className="bi bi-check-circle-fill"></i> {product.stock > 0 ? `In stock — ${product.stock} available` : "Currently unavailable"}</div><div className="detail-actions"><div className="quantity-control"><button onClick={() => setQty(Math.max(1, qty-1))}>−</button><span>{qty}</span><button onClick={() => setQty(qty+1)}>+</button></div><button className="btn btn-forest flex-grow-1" onClick={() => addToCart(product, qty)}>Add to bag — {money(product.price*qty)}</button><button className={`detail-wish ${wished ? "wished" : ""}`} onClick={() => toggleWishlist(product)}><i className={`bi ${wished ? "bi-heart-fill" : "bi-heart"}`}></i></button></div><div className="care-specs"><div><small>PLANT SIZE</small><b>{product.size}</b></div><div><small>LIGHT</small><b>{product.light}</b></div><div><small>WATER</small><b>{product.water}</b></div></div><div className="detail-promise"><i className="bi bi-box-seam"></i> Carefully packed for its journey to you.</div></div></div></main>;
}

function Cart({ items, changeQty }) {
  const subtotal = items.reduce((n,x) => n + x.price*x.qty, 0);
  return <main className="container page-space"><SectionHeading kicker="YOUR GREENLEAF BAG" title="A little goodness, on its way" text="Review your selection before you head to checkout."/>
    {items.length === 0 ? <div className="empty-state"><i className="bi bi-bag"></i><h3>Your bag is taking a little rest</h3><p>Add a plant you love and it will appear here.</p><Link className="btn btn-forest" to="/shop">Explore plants</Link></div> :
    <div className="row g-5 mt-2"><div className="col-lg-8">{items.map(item => <div className="cart-row" key={item.id}><img src={item.image} alt={item.name} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/hero-real-plants.png"; }}/><div className="cart-item-info"><Link to={`/product/${item.id}`}>{item.name}</Link><small>{item.category}</small><b>{money(item.price)}</b><div className="quantity-control compact"><button onClick={() => changeQty(item.id,item.qty-1)}>−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id,item.qty+1)}>+</button></div></div><button className="remove-btn" onClick={() => changeQty(item.id,0)} aria-label="Remove item"><i className="bi bi-trash3"></i></button></div>)}</div><div className="col-lg-4"><div className="summary-card"><h4>Order summary</h4><div><span>Subtotal</span><b>{money(subtotal)}</b></div><div><span>Delivery</span><span>Calculated at checkout</span></div><hr/><div className="summary-total"><span>Estimated total</span><b>{money(subtotal)}</b></div><Link to="/checkout" className="btn btn-forest w-100 mt-3">Continue to checkout</Link><p className="secure-note"><i className="bi bi-shield-check"></i> Secure checkout experience</p></div></div></div>}
  </main>;
}

function Wishlist({ items, toggleWishlist, addToCart }) {
  return <main className="container page-space"><SectionHeading kicker="SAVED FOR LATER" title="Your wishlist" text="The plants you have your eye on."/><ProductGrid items={items} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={items}/></main>;
}

function Checkout({ items, setCart, orders, setOrders, user, notify }) {
  const navigate = useNavigate(); const total = items.reduce((n,x) => n+x.price*x.qty,0);
  const [form, setForm] = useState({name:user?.name || "", email:user?.email || "", phone:"", address:"", city:"", pincode:"", payment:"Cash on delivery"});
  const [done, setDone] = useState(null);
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = e => {
    e.preventDefault();
    if (!items.length) return;
    const order = { orderId:"GL"+Date.now().toString().slice(-7), date:new Date().toLocaleDateString("en-IN"), items, total, customer:form, status:"Order placed" };
    setOrders([order,...orders]); setCart([]); setDone(order);
  };
  if (done) return <main className="container page-space"><div className="success-panel"><div className="success-icon"><i className="bi bi-check-lg"></i></div><span className="eyebrow">THANK YOU FOR GROWING WITH US</span><h1>Your order is placed!</h1><p>Your demo order reference is <b>{done.orderId}</b>.</p><p className="muted">This prototype records the order in this browser only. No payment has been processed.</p><Link to="/track-order" className="btn btn-forest">Track your order</Link></div></main>;
  if (!items.length) return <main className="container page-space"><div className="empty-state"><h3>Your bag is empty</h3><Link to="/shop" className="btn btn-forest">Shop plants</Link></div></main>;
  return <main className="container page-space"><SectionHeading kicker="ALMOST YOURS" title="Checkout" text="Add your delivery details to place a demo order."/><form className="row g-4 mt-2" onSubmit={submit}><div className="col-lg-7"><div className="checkout-card"><h4>Delivery details</h4><div className="row g-3"><Field label="Full name" name="name" value={form.name} onChange={update} required/><Field label="Email address" name="email" type="email" value={form.email} onChange={update} required/><Field label="Phone number" name="phone" value={form.phone} onChange={update} required/><Field label="PIN code" name="pincode" value={form.pincode} onChange={update} required/><div className="col-12"><label className="form-label">Delivery address</label><textarea className="form-control" name="address" value={form.address} onChange={update} rows="3" required/></div><Field label="City" name="city" value={form.city} onChange={update} required/></div><h4 className="mt-4">Payment method</h4><select className="form-select" name="payment" value={form.payment} onChange={update}><option>Cash on delivery</option><option>Demo online payment (not processed)</option></select></div></div><div className="col-lg-5"><div className="summary-card"><h4>Your order</h4>{items.map(x=><div className="checkout-line" key={x.id}><span>{x.name} × {x.qty}</span><b>{money(x.price*x.qty)}</b></div>)}<hr/><div className="summary-total"><span>Total</span><b>{money(total)}</b></div><button className="btn btn-forest w-100 mt-3">Place demo order</button><p className="secure-note">Demo checkout only. Connect a secure payment provider before accepting real payments.</p></div></div></form></main>;
}
function Field({label,name,value,onChange,type="text",required=false}) { return <div className="col-md-6"><label className="form-label">{label}</label><input className="form-control" name={name} type={type} value={value} onChange={onChange} required={required}/></div>; }

function Account({ user, setUser, notify }) {
  const [form,setForm] = useState({name:"",email:""});
  const submit = e => {e.preventDefault(); const next={...form};setUser(next);notify("Demo account signed in");};
  return <main className="container page-space"><div className="account-card"><span className="eyebrow">YOUR GREENLEAF ACCOUNT</span><h1>{user ? `Hello, ${user.name}` : "Welcome back"}</h1>{user ? <><p>You are signed in to this browser demo as {user.email}.</p><button className="btn btn-outline-dark" onClick={()=>{setUser(null);notify("Signed out");}}>Sign out</button></> : <form onSubmit={submit}><p>Create a demo session to prefill your checkout details.</p><div className="mb-3"><label className="form-label">Your name</label><input className="form-control" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="mb-3"><label className="form-label">Email address</label><input type="email" className="form-control" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><button className="btn btn-forest w-100">Continue</button></form>}</div></main>;
}

function TrackOrder({ orders }) {
  const [query,setQuery] = useState(""); const found = orders.find(o=>o.orderId.toLowerCase()===query.trim().toLowerCase());
  return <main className="container page-space"><div className="account-card wide"><span className="eyebrow">A LITTLE UPDATE</span><h1>Track your order</h1><p>Enter the order reference shown after checkout.</p><div className="input-group"><input className="form-control" placeholder="e.g. GL1234567" value={query} onChange={e=>setQuery(e.target.value)}/><button className="btn btn-forest" onClick={()=>{}}>Find order</button></div>{query && (found ? <div className="tracking-result"><b>{found.orderId}</b><span className="status-pill">{found.status}</span><p>Placed on {found.date} · {money(found.total)}</p><small>Demo order saved in this browser.</small></div> : <p className="muted mt-3">No matching order found in this browser.</p>)}</div></main>;
}

function Admin({ orders }) {
  const [tab,setTab] = useState("overview");
  const revenue = orders.reduce((n,o)=>n+o.total,0);
  return <main className="container page-space"><div className="admin-head"><div><span className="eyebrow">GREENLEAF CONTROL ROOM</span><h1>Admin dashboard</h1><p>Sample management view for the frontend prototype.</p></div><span className="demo-label">DEMO DATA</span></div><div className="admin-tabs">{["overview","products","orders"].map(t=><button className={tab===t?"selected":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>{tab==="overview" && <div className="row g-3 mt-2"><Metric label="Products in catalogue" value={products.length}/><Metric label="Demo orders" value={orders.length}/><Metric label="Recorded order value" value={money(revenue)}/><Metric label="Wishlist-ready products" value={products.length}/></div>}{tab==="products" && <div className="table-responsive"><table className="table admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td></tr>)}</tbody></table></div>}{tab==="orders" && <div className="table-responsive"><table className="table admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o=><tr key={o.orderId}><td>{o.orderId}</td><td>{o.customer.name}</td><td>{o.date}</td><td>{money(o.total)}</td><td>{o.status}</td></tr>)}</tbody></table>{!orders.length && <p className="muted">No demo orders yet. Place an order through checkout to see it here.</p>}</div>}</main>;
}
function Metric({label,value}) {return <div className="col-md-6 col-xl-3"><div className="metric-card"><span>{label}</span><b>{value}</b></div></div>;}
function NotFound(){return <main className="container page-space text-center"><h1>We couldn't find that page.</h1><Link to="/shop" className="btn btn-forest mt-3">Back to the shop</Link></main>;}
function Footer(){return <footer className="site-footer"><div className="container"><div className="row g-4 py-5"><div className="col-lg-4"><Link className="brand footer-brand" to="/"><span className="brand-mark"><i className="bi bi-flower1"></i></span><span>greenleaf<small>PLANTS • LIVING • GROWING</small></span></Link><p className="footer-about">Thoughtfully chosen plants and little things to make everyday spaces feel more alive.</p><div className="socials"><a href="#instagram" aria-label="Instagram"><i className="bi bi-instagram"></i></a><a href="#pinterest" aria-label="Pinterest"><i className="bi bi-pinterest"></i></a><a href="#facebook" aria-label="Facebook"><i className="bi bi-facebook"></i></a></div></div><div className="col-6 col-lg-2"><h6>Explore</h6><Link to="/shop">Shop all</Link><Link to="/category/Indoor%20Plants">Indoor plants</Link><Link to="/category/Outdoor%20Plants">Outdoor plants</Link><Link to="/category/Succulents">Succulents</Link></div><div className="col-6 col-lg-2"><h6>Help</h6><Link to="/track-order">Track order</Link><Link to="/account">My account</Link><Link to="/cart">Shopping bag</Link><Link to="/admin">Admin demo</Link></div><div className="col-lg-4"><h6>Stay in the loop</h6><p className="footer-about">Plant notes, new arrivals and a little inspiration for greener living.</p><form className="newsletter" onSubmit={e=>{e.preventDefault();e.currentTarget.reset();}}><input type="email" placeholder="Your email address" required/><button aria-label="Subscribe"><i className="bi bi-arrow-right"></i></button></form><small className="demo-disclaimer">Demo storefront · Connect real services before launch.</small></div></div><div className="footer-bottom"><span>© 2026 GreenLeaf. Grow a little every day.</span><span>Designed with care <i className="bi bi-heart-fill"></i></span></div></div></footer>;}

export default App;