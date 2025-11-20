import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

const PRODUCTS = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 2499,
    category: "Electronics",
    rating: 4.6,
    description:
      "Comfortable over-ear wireless headphones with deep bass and 20+ hours playback.",
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 3499,
    category: "Wearables",
    rating: 4.4,
    description:
      "Track your health, notifications, and workouts with a bright AMOLED display.",
  },
  {
    id: "3",
    name: "Gaming Mouse",
    price: 1599,
    category: "Accessories",
    rating: 4.7,
    description:
      "Ergonomic design with custom DPI, RGB lighting and programmable buttons.",
  },
  {
    id: "4",
    name: "Bluetooth Speaker",
    price: 1999,
    category: "Audio",
    rating: 4.3,
    description:
      "Portable speaker with punchy sound and splash-proof design for outdoor usage.",
  },
];

const formatPrice = (p) => `₹${p.toLocaleString("en-IN")}`;

export default function App() {
  const [screen, setScreen] = useState("welcome"); // 'welcome' | 'products' | 'details' | 'cart'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const openProducts = () => setScreen("products");

  const openDetails = (product) => {
    setSelectedProduct(product);
    setScreen("details");
  };

  const openCart = () => setScreen("cart");

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setScreen("cart");
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>Product Application</Text>
        <Text style={styles.appSubtitle}>Explore · Compare · Buy</Text>
      </View>

      {screen === "welcome" && (
        <WelcomeScreen
          onGetStarted={openProducts}
          productCount={PRODUCTS.length}
        />
      )}

      {screen === "products" && (
        <ProductsScreen
          products={PRODUCTS}
          onSelectProduct={openDetails}
          onOpenCart={openCart}
          cartCount={cart.length}
        />
      )}

      {screen === "details" && selectedProduct && (
        <DetailsScreen
          product={selectedProduct}
          onBack={openProducts}
          onAddToCart={handleAddToCart}
        />
      )}

      {screen === "cart" && (
        <CartScreen
          cart={cart}
          total={cartTotal}
          onBack={openProducts}
          onClearCart={() => setCart([])}
        />
      )}

      <BottomNav
        current={screen}
        onWelcome={() => setScreen("welcome")}
        onProducts={openProducts}
        onCart={openCart}
        cartCount={cart.length}
      />
    </SafeAreaView>
  );
}

/* ----------------- SCREENS ----------------- */

function WelcomeScreen({ onGetStarted, productCount }) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.welcomeCard}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
          <Text style={styles.badgeSubtitle}>Semester Project Ready</Text>
        </View>

        <Text style={styles.welcomeTitle}>Welcome 👋</Text>
        <Text style={styles.welcomeTitleAccent}>to your Product Store</Text>

        <Text style={styles.welcomeText}>
          Browse curated {productCount}+ tech products, view details, and add
          them to your cart – all in one clean interface that works on both
          mobile and web.
        </Text>

        <View style={styles.welcomeStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{productCount}+</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.5★</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Fast</Text>
            <Text style={styles.statLabel}>UX Focused</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ProductsScreen({ products, onSelectProduct, onOpenCart, cartCount }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => onSelectProduct(item)}
    >
      <View style={styles.productHeaderRow}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productRating}>{item.rating.toFixed(1)}★</Text>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      <Text style={styles.productDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooterRow}>
        <Text style={styles.cardHintText}>Tap for more details</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderRow}>
        <Text style={styles.screenTitle}>Featured Products</Text>
        <TouchableOpacity style={styles.cartChip} onPress={onOpenCart}>
          <Text style={styles.cartChipText}>Cart ({cartCount})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function DetailsScreen({ product, onBack, onAddToCart }) {
  return (
    <View style={styles.screenContainer}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backText}>← Back to products</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.detailsScroll}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.detailsCategory}>{product.category}</Text>
        <Text style={styles.detailsTitle}>{product.name}</Text>

        <View style={styles.detailsMetaRow}>
          <Text style={styles.detailsRating}>{product.rating.toFixed(1)}★</Text>
          <Text style={styles.detailsPrice}>{formatPrice(product.price)}</Text>
        </View>

        <Text style={styles.detailsDescription}>{product.description}</Text>

        <View style={styles.detailsTagRow}>
          <View style={styles.detailsTag}>
            <Text style={styles.detailsTagText}>Fast Delivery</Text>
          </View>
          <View style={styles.detailsTag}>
            <Text style={styles.detailsTagText}>1 Year Warranty</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onAddToCart(product)}
        >
          <Text style={styles.primaryButtonText}>
            Add to Cart • {formatPrice(product.price)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function CartScreen({ cart, total, onBack, onClearCart }) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Your Cart</Text>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCartBox}>
          <Text style={styles.emptyCartTitle}>Cart is empty</Text>
          <Text style={styles.emptyCartText}>
            Start adding some products to see them here.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(_, index) => String(index)}
            renderItem={({ item }) => (
              <View style={styles.cartItemRow}>
                <View>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemCategory}>{item.category}</Text>
                </View>
                <Text style={styles.cartItemPrice}>
                  {formatPrice(item.price)}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.cartSummaryBox}>
            <View>
              <Text style={styles.cartSummaryLabel}>Total</Text>
              <Text style={styles.cartSummaryAmount}>
                {formatPrice(total)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClearCart}
            >
              <Text style={styles.secondaryButtonText}>Clear Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* ----------------- BOTTOM NAV ----------------- */

function BottomNav({ current, onWelcome, onProducts, onCart, cartCount }) {
  return (
    <View style={styles.bottomNav}>
      <NavItem
        label="Welcome"
        active={current === "welcome"}
        onPress={onWelcome}
      />
      <NavItem
        label="Products"
        active={current === "products" || current === "details"}
        onPress={onProducts}
      />
      <NavItem
        label={`Cart${cartCount ? ` (${cartCount})` : ""}`}
        active={current === "cart"}
        onPress={onCart}
      />
    </View>
  );
}

function NavItem({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.navItem, active && styles.navItemActive]}
      onPress={onPress}
    >
      <Text
        style={[styles.navItemText, active && styles.navItemTextActive]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ----------------- STYLES ----------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617", // slate-950
  },
  appHeader: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  appSubtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 2,
  },

  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  /* Welcome */
  welcomeCard: {
    marginTop: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#22c55e",
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#022c22",
  },
  badgeSubtitle: {
    fontSize: 11,
    color: "#9ca3af",
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#e5e7eb",
    marginTop: 16,
  },
  welcomeTitleAccent: {
    fontSize: 20,
    fontWeight: "600",
    color: "#38bdf8",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#9ca3af",
    marginTop: 4,
  },
  welcomeStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },

  /* Buttons */
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#22c55e",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#052e16",
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4b5563",
  },
  secondaryButtonText: {
    fontSize: 13,
    color: "#e5e7eb",
  },

  /* Products list */
  screenHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e5e7eb",
  },
  cartChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#1d4ed8",
  },
  cartChipText: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: "500",
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 80,
  },
  productCard: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 12,
  },
  productHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 11,
    color: "#9ca3af",
  },
  productRating: {
    fontSize: 11,
    fontWeight: "600",
    color: "#facc15",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e",
    marginTop: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 6,
  },
  cardFooterRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHintText: {
    fontSize: 11,
    color: "#6b7280",
  },

  /* Details */
  backText: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 8,
  },
  detailsScroll: {
    marginTop: 8,
  },
  detailsContent: {
    paddingBottom: 90,
  },
  detailsCategory: {
    fontSize: 12,
    color: "#9ca3af",
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e5e7eb",
    marginTop: 4,
  },
  detailsMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  detailsRating: {
    fontSize: 13,
    color: "#facc15",
    fontWeight: "600",
  },
  detailsPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#22c55e",
  },
  detailsDescription: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 10,
    lineHeight: 20,
  },
  detailsTagRow: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 10,
  },
  detailsTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginRight: 8,
  },
  detailsTagText: {
    fontSize: 11,
    color: "#e5e7eb",
  },

  /* Cart */
  emptyCartBox: {
    marginTop: 30,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
  },
  emptyCartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  emptyCartText: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  cartItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 8,
  },
  cartItemName: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "600",
  },
  cartItemCategory: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#22c55e",
  },
  cartSummaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginTop: 4,
    marginBottom: 80,
  },
  cartSummaryLabel: {
    fontSize: 12,
    color: "#9ca3af",
  },
  cartSummaryAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5e7eb",
    marginTop: 2,
  },

  /* Bottom nav */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#111827",
    backgroundColor: "#020617",
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  navItemActive: {
    backgroundColor: "#1d4ed8",
  },
  navItemText: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  navItemTextActive: {
    color: "#e5e7eb",
  },
});
