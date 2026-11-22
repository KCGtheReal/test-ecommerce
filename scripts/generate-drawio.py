import os
import xml.etree.ElementTree as ET

def create_erd_drawio():
    mxfile = ET.Element("mxfile", {
        "host": "app.diagrams.net",
        "modified": "2026-11-22T14:45:00.000Z",
        "agent": "Mozilla/5.0",
        "version": "24.0.0",
        "type": "device"
    })
    
    diagram = ET.SubElement(mxfile, "diagram", {
        "id": "EcommerceERD",
        "name": "E-Commerce ERD (Practical Exercise 4)"
    })
    
    model = ET.SubElement(diagram, "mxGraphModel", {
        "dx": "1422",
        "dy": "794",
        "grid": "1",
        "gridSize": "10",
        "guides": "1",
        "tooltips": "1",
        "connect": "1",
        "arrows": "1",
        "fold": "1",
        "page": "1",
        "pageScale": "1",
        "pageWidth": "1200",
        "pageHeight": "850",
        "background": "#F8FAFC",
        "math": "0",
        "shadow": "0"
    })
    
    root = ET.SubElement(model, "root")
    
    # Base cells
    ET.SubElement(root, "mxCell", {"id": "0"})
    ET.SubElement(root, "mxCell", {"id": "1", "parent": "0"})
    
    # Title Banner
    title_cell = ET.SubElement(root, "mxCell", {
        "id": "title_banner",
        "value": "&lt;b style=&quot;font-size: 20px;&quot;&gt;E-Commerce Order Database ERD&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size: 13px; color: #64748B;&quot;&gt;Entity Relationship Diagram — Practical Exercise 4 (Customers, Categories, Products, Orders, Order_Items)&lt;/span&gt;",
        "style": "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;",
        "vertex": "1",
        "parent": "1"
    })
    ET.SubElement(title_cell, "mxGeometry", {"x": "260", "y": "25", "width": "680", "height": "50", "as": "geometry"})

    # Legend / Info Box
    legend_cell = ET.SubElement(root, "mxCell", {
        "id": "legend_box",
        "value": "&lt;b&gt;Cardinality &amp; Integrity Legend:&lt;/b&gt;&lt;br&gt;• &lt;b&gt;PK&lt;/b&gt; = Primary Key (Auto-Increment)&lt;br&gt;• &lt;b&gt;FK&lt;/b&gt; = Foreign Key Reference&lt;br&gt;• &lt;b&gt;UK&lt;/b&gt; = Unique Constraint&lt;br&gt;• &lt;b&gt;1:N&lt;/b&gt; = One-to-Many Crow's Foot Connector&lt;br&gt;• &lt;i style=&quot;color: #DC2626;&quot;&gt;ON DELETE CASCADE&lt;/i&gt; on Order_Items",
        "style": "rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;align=left;spacingLeft=12;spacingRight=12;fontSize=11;fontColor=#334155;shadow=1;",
        "vertex": "1",
        "parent": "1"
    })
    ET.SubElement(legend_cell, "mxGeometry", {"x": "60", "y": "670", "width": "260", "height": "110", "as": "geometry"})

    # Helper function for tables
    def add_table(table_id, name, x, y, width, header_color, stroke_color, columns):
        header_height = 32
        row_height = 24
        total_height = header_height + (len(columns) * row_height)
        
        # Parent Swimlane
        table = ET.SubElement(root, "mxCell", {
            "id": table_id,
            "value": f"&lt;b&gt;{name}&lt;/b&gt;",
            "style": f"swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize={header_height};horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=0;marginBottom=0;html=1;fillColor={header_color};strokeColor={stroke_color};fontColor=#0F172A;fontSize=13;shadow=1;rounded=1;arcSize=4;",
            "vertex": "1",
            "parent": "1"
        })
        ET.SubElement(table, "mxGeometry", {"x": str(x), "y": str(y), "width": str(width), "height": str(total_height), "as": "geometry"})
        
        for i, col in enumerate(columns):
            row_id = f"{table_id}_col_{i}"
            col_bg = "#FFFFFF" if i % 2 == 0 else "#F8FAFC"
            badge = ""
            if "PK" in col[0]:
                badge = f"&lt;span style=&quot;color: #D97706; font-weight: bold;&quot;&gt;[PK]&lt;/span&gt; "
            elif "FK" in col[0]:
                badge = f"&lt;span style=&quot;color: #2563EB; font-weight: bold;&quot;&gt;[FK]&lt;/span&gt; "
            elif "UK" in col[0]:
                badge = f"&lt;span style=&quot;color: #059669; font-weight: bold;&quot;&gt;[UK]&lt;/span&gt; "
                
            val = f"&amp;nbsp;{badge}&lt;b&gt;{col[1]}&lt;/b&gt;: &lt;i style=&quot;color: #64748B;&quot;&gt;{col[2]}&lt;/i&gt;"
            row = ET.SubElement(root, "mxCell", {
                "id": row_id,
                "value": val,
                "style": f"text;strokeColor=none;fillColor={col_bg};align=left;verticalAlign=middle;spacingLeft=8;spacingRight=8;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;whiteSpace=wrap;html=1;fontSize=11;fontColor=#1E293B;",
                "vertex": "1",
                "parent": table_id
            })
            ET.SubElement(row, "mxGeometry", {"y": str(header_height + (i * row_height)), "width": str(width), "height": str(row_height), "as": "geometry"})

    # 1. CATEGORIES (Top Left)
    categories_cols = [
        ("PK", "id", "INTEGER (PK, AUTO)"),
        ("UK", "name", "VARCHAR(100) NOT NULL"),
        ("UK", "slug", "VARCHAR(100) NOT NULL"),
        ("", "description", "TEXT NULLABLE"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_categories", "CATEGORIES", 60, 140, 240, "#E0E7FF", "#6366F1", categories_cols)

    # 2. PRODUCTS (Top Center)
    products_cols = [
        ("PK", "id", "INTEGER (PK, AUTO)"),
        ("", "name", "VARCHAR(255) NOT NULL"),
        ("UK", "slug", "VARCHAR(255) NOT NULL"),
        ("", "description", "TEXT NULLABLE"),
        ("", "price", "DECIMAL(10,2) NOT NULL"),
        ("", "imageUrl", "TEXT NOT NULL"),
        ("", "stock", "INTEGER DEFAULT 50"),
        ("FK", "categoryId", "INTEGER (FK -> categories.id)"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_products", "PRODUCTS", 420, 140, 270, "#FEF3C7", "#D97706", products_cols)

    # 3. CUSTOMERS (Top Right)
    customers_cols = [
        ("PK", "id", "INTEGER (PK, AUTO)"),
        ("", "firstName", "VARCHAR(100) NOT NULL"),
        ("", "lastName", "VARCHAR(100) NOT NULL"),
        ("UK", "email", "VARCHAR(255) NOT NULL"),
        ("", "phone", "VARCHAR(50) NOT NULL"),
        ("", "address", "TEXT NOT NULL"),
        ("", "city", "VARCHAR(100) NOT NULL"),
        ("", "state", "VARCHAR(100) NOT NULL"),
        ("", "zipCode", "VARCHAR(20) NOT NULL"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_customers", "CUSTOMERS", 810, 140, 260, "#DCFCE7", "#16A34A", customers_cols)

    # 4. ORDER_ITEMS (Bottom Center)
    order_items_cols = [
        ("PK", "id", "INTEGER (PK, AUTO)"),
        ("FK", "orderId", "INTEGER (FK -> orders.id)"),
        ("FK", "productId", "INTEGER (FK -> products.id)"),
        ("", "quantity", "INTEGER (CHECK > 0)"),
        ("", "price", "DECIMAL(10,2) NOT NULL"),
        ("", "total", "DECIMAL(10,2) NOT NULL"),
        ("", "createdAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_order_items", "ORDER_ITEMS", 420, 500, 270, "#FCE7F3", "#DB2777", order_items_cols)

    # 5. ORDERS (Bottom Right)
    orders_cols = [
        ("PK", "id", "INTEGER (PK, AUTO)"),
        ("UK", "orderNumber", "VARCHAR(50) (e.g. ORD-0001)"),
        ("FK", "customerId", "INTEGER (FK -> customers.id)"),
        ("", "status", "VARCHAR(50) DEFAULT 'Pending'"),
        ("", "subtotal", "DECIMAL(10,2) NOT NULL"),
        ("", "shippingMethod", "VARCHAR(100) NOT NULL"),
        ("", "shippingCost", "DECIMAL(10,2) DEFAULT 0.00"),
        ("", "tax", "DECIMAL(10,2) DEFAULT 0.00"),
        ("", "total", "DECIMAL(10,2) NOT NULL"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_orders", "ORDERS", 810, 480, 260, "#E0F2FE", "#0284C7", orders_cols)

    # Helper function for Crow's Foot Relationships
    def add_relationship(edge_id, label, source_id, target_id, source_port, target_port, stroke_color):
        edge = ET.SubElement(root, "mxCell", {
            "id": edge_id,
            "value": f"&lt;b&gt;{label}&lt;/b&gt;",
            "style": f"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;startArrow=ERone;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2.5;strokeColor={stroke_color};fontColor=#0F172A;fontSize=11;labelBackgroundColor=#FFFFFF;labelBorderColor={stroke_color};",
            "edge": "1",
            "parent": "1",
            "source": source_id,
            "target": target_id
        })
        geo = ET.SubElement(edge, "mxGeometry", {"relative": "1", "as": "geometry"})
        if source_port and target_port:
            edge.set("style", edge.get("style") + f"exitX={source_port[0]};exitY={source_port[1]};entryX={target_port[0]};entryY={target_port[1]};")

    # Connector 1: CATEGORIES (1) -> PRODUCTS (N)
    add_relationship("rel_cat_prod", "1 : N (categorizes)", "tbl_categories", "tbl_products", (1.0, 0.4), (0.0, 0.4), "#6366F1")

    # Connector 2: CUSTOMERS (1) -> ORDERS (N)
    add_relationship("rel_cust_ord", "1 : N (places)", "tbl_customers", "tbl_orders", (0.5, 1.0), (0.5, 0.0), "#16A34A")

    # Connector 3: ORDERS (1) -> ORDER_ITEMS (N)
    add_relationship("rel_ord_items", "1 : N (contains)", "tbl_orders", "tbl_order_items", (0.0, 0.4), (1.0, 0.4), "#0284C7")

    # Connector 4: PRODUCTS (1) -> ORDER_ITEMS (N)
    add_relationship("rel_prod_items", "1 : N (ordered_in)", "tbl_products", "tbl_order_items", (0.5, 1.0), (0.5, 0.0), "#D97706")

    # Write files
    xml_str = ET.tostring(mxfile, encoding="utf-8", method="xml").decode("utf-8")
    
    # Save to workspace root
    root_path = "ecommerce_erd.drawio"
    with open(root_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
    print(f"Created {root_path}")
    
    # Save to public/ for web access
    os.makedirs("public", exist_ok=True)
    pub_path = os.path.join("public", "ecommerce_erd.drawio")
    with open(pub_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
    print(f"Created {pub_path}")

if __name__ == "__main__":
    create_erd_drawio()
