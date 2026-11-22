import os
import xml.etree.ElementTree as ET

def generate_clean_erd():
    mxfile = ET.Element("mxfile", {
        "host": "app.diagrams.net",
        "modified": "2026-11-22T14:52:00.000Z",
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
        "dy": "850",
        "grid": "1",
        "gridSize": "10",
        "guides": "1",
        "tooltips": "1",
        "connect": "1",
        "arrows": "1",
        "fold": "1",
        "page": "1",
        "pageScale": "1",
        "pageWidth": "1300",
        "pageHeight": "900",
        "background": "#F8FAFC",
        "math": "0",
        "shadow": "0"
    })
    
    root = ET.SubElement(model, "root")
    ET.SubElement(root, "mxCell", {"id": "0"})
    ET.SubElement(root, "mxCell", {"id": "1", "parent": "0"})
    
    # Title Banner (Clean HTML, single escape)
    title_html = (
        '<div style="text-align: center; font-family: Inter, Segoe UI, sans-serif;">'
        '<span style="font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">E-Commerce Order Database ERD</span><br>'
        '<span style="font-size: 13px; font-weight: 500; color: #64748B;">Relational Entity-Relationship Diagram — Practical Exercise 4 (Customers, Categories, Products, Orders, Order_Items)</span>'
        '</div>'
    )
    title_cell = ET.SubElement(root, "mxCell", {
        "id": "title_banner",
        "value": title_html,
        "style": "text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;",
        "vertex": "1",
        "parent": "1"
    })
    ET.SubElement(title_cell, "mxGeometry", {"x": "260", "y": "25", "width": "750", "height": "50", "as": "geometry"})

    # Legend Box
    legend_html = (
        '<div style="font-family: Inter, Segoe UI, sans-serif; font-size: 11px; line-height: 1.6; color: #1E293B;">'
        '<b style="font-size: 12px; color: #0F172A;">Cardinality &amp; Key Legend:</b><br>'
        '• <span style="color: #D97706; font-weight: 800;">[PK]</span> Primary Key (Auto-Increment)<br>'
        '• <span style="color: #2563EB; font-weight: 800;">[FK]</span> Foreign Key Reference<br>'
        '• <span style="color: #059669; font-weight: 800;">[UK]</span> Unique Constraint<br>'
        '• <b style="color: #4F46E5;">1 : N</b> One-to-Many Crow\'s Foot Connector<br>'
        '• <span style="color: #DC2626; font-weight: 700;">ON DELETE CASCADE</span> on Order_Items'
        '</div>'
    )
    legend_cell = ET.SubElement(root, "mxCell", {
        "id": "legend_box",
        "value": legend_html,
        "style": "rounded=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;strokeWidth=1.5;align=left;spacingLeft=14;spacingRight=14;shadow=1;",
        "vertex": "1",
        "parent": "1"
    })
    ET.SubElement(legend_cell, "mxGeometry", {"x": "50", "y": "670", "width": "280", "height": "125", "as": "geometry"})

    # Table Generator
    def add_table(table_id, name, x, y, width, header_color, stroke_color, columns):
        header_height = 36
        row_height = 26
        total_height = header_height + (len(columns) * row_height)
        
        # Swimlane container with colored header
        table = ET.SubElement(root, "mxCell", {
            "id": table_id,
            "value": f'<span style="font-size: 13px; font-weight: 800; letter-spacing: 0.5px; color: #FFFFFF;">{name}</span>',
            "style": (
                f"swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;"
                f"horizontal=1;startSize={header_height};horizontalStack=0;resizeParent=1;resizeParentMax=0;"
                f"resizeLast=0;collapsible=0;marginBottom=0;html=1;whiteSpace=wrap;"
                f"fillColor={header_color};strokeColor={stroke_color};strokeWidth=2;fontColor=#FFFFFF;"
                f"rounded=1;arcSize=6;shadow=1;"
            ),
            "vertex": "1",
            "parent": "1"
        })
        ET.SubElement(table, "mxGeometry", {"x": str(x), "y": str(y), "width": str(width), "height": str(total_height), "as": "geometry"})
        
        for i, col in enumerate(columns):
            row_id = f"{table_id}_col_{i}"
            col_bg = "#FFFFFF" if i % 2 == 0 else "#F8FAFC"
            
            badge_html = ""
            if col[0] == "PK":
                badge_html = '<span style="color: #D97706; font-weight: 800; font-family: monospace;">PK</span>&nbsp;&nbsp;'
            elif col[0] == "FK":
                badge_html = '<span style="color: #2563EB; font-weight: 800; font-family: monospace;">FK</span>&nbsp;&nbsp;'
            elif col[0] == "UK":
                badge_html = '<span style="color: #059669; font-weight: 800; font-family: monospace;">UK</span>&nbsp;&nbsp;'
            else:
                badge_html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'

            row_val = (
                f'<div style="font-family: Inter, Segoe UI, sans-serif; font-size: 11px;">'
                f'{badge_html}'
                f'<b style="color: #0F172A;">{col[1]}</b>'
                f'&nbsp;:&nbsp;<span style="color: #64748B; font-family: monospace; font-size: 10.5px;">{col[2]}</span>'
                f'</div>'
            )
            
            row = ET.SubElement(root, "mxCell", {
                "id": row_id,
                "value": row_val,
                "style": (
                    f"text;strokeColor=#E2E8F0;strokeWidth=0.5;fillColor={col_bg};align=left;verticalAlign=middle;"
                    f"spacingLeft=10;spacingRight=10;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];"
                    f"portConstraint=eastwest;whiteSpace=wrap;html=1;"
                ),
                "vertex": "1",
                "parent": table_id
            })
            ET.SubElement(row, "mxGeometry", {"y": str(header_height + (i * row_height)), "width": str(width), "height": str(row_height), "as": "geometry"})

    # 1. CATEGORIES (Top Left)
    cat_cols = [
        ("PK", "id", "INTEGER PRIMARY KEY"),
        ("UK", "name", "TEXT NOT NULL UNIQUE"),
        ("UK", "slug", "TEXT NOT NULL UNIQUE"),
        ("", "description", "TEXT NULLABLE"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_categories", "CATEGORIES", 50, 130, 270, "#4F46E5", "#4338CA", cat_cols)

    # 2. PRODUCTS (Top Center)
    prod_cols = [
        ("PK", "id", "INTEGER PRIMARY KEY"),
        ("", "name", "TEXT NOT NULL"),
        ("UK", "slug", "TEXT NOT NULL UNIQUE"),
        ("", "description", "TEXT NULLABLE"),
        ("", "price", "REAL NOT NULL ($)"),
        ("", "imageUrl", "TEXT NULLABLE"),
        ("", "stock", "INTEGER DEFAULT 50"),
        ("FK", "categoryId", "INTEGER -> categories.id"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_products", "PRODUCTS", 450, 130, 310, "#D97706", "#B45309", prod_cols)

    # 3. CUSTOMERS (Top Right)
    cust_cols = [
        ("PK", "id", "INTEGER PRIMARY KEY"),
        ("", "firstName", "TEXT NOT NULL"),
        ("", "lastName", "TEXT NOT NULL"),
        ("UK", "email", "TEXT NOT NULL UNIQUE"),
        ("", "phone", "TEXT NOT NULL"),
        ("", "address", "TEXT NOT NULL"),
        ("", "city", "TEXT NOT NULL"),
        ("", "state", "TEXT NOT NULL"),
        ("", "zipCode", "TEXT NOT NULL"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_customers", "CUSTOMERS", 880, 130, 300, "#059669", "#047857", cust_cols)

    # 4. ORDER_ITEMS (Bottom Center)
    item_cols = [
        ("PK", "id", "INTEGER PRIMARY KEY"),
        ("FK", "orderId", "INTEGER -> orders.id (CASCADE)"),
        ("FK", "productId", "INTEGER -> products.id"),
        ("", "quantity", "INTEGER (CHECK > 0)"),
        ("", "price", "REAL (Snapshot Price)"),
        ("", "total", "REAL (qty * price)"),
        ("", "createdAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_order_items", "ORDER_ITEMS", 450, 490, 310, "#E11D48", "#BE123C", item_cols)

    # 5. ORDERS (Bottom Right)
    order_cols = [
        ("PK", "id", "INTEGER PRIMARY KEY"),
        ("UK", "orderNumber", "TEXT NOT NULL (e.g. ORD-0001)"),
        ("FK", "customerId", "INTEGER -> customers.id"),
        ("", "status", "TEXT DEFAULT 'Pending'"),
        ("", "subtotal", "REAL NOT NULL"),
        ("", "shippingMethod", "TEXT ('free' / 'express')"),
        ("", "shippingCost", "REAL DEFAULT 0.00"),
        ("", "tax", "REAL DEFAULT 0.00"),
        ("", "total", "REAL NOT NULL (Grand Total)"),
        ("", "createdAt", "DATETIME DEFAULT NOW"),
        ("", "updatedAt", "DATETIME DEFAULT NOW")
    ]
    add_table("tbl_orders", "ORDERS", 880, 460, 300, "#0284C7", "#0369A1", order_cols)

    # Relationships (Crow's Foot Connectors)
    def add_rel(edge_id, label, src, dst, src_pt, dst_pt, stroke_color):
        edge = ET.SubElement(root, "mxCell", {
            "id": edge_id,
            "value": f'<span style="font-family: Inter, sans-serif; font-size: 11px; font-weight: 800; color: #0F172A;">{label}</span>',
            "style": (
                f"edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;"
                f"startArrow=ERone;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=2.5;strokeColor={stroke_color};"
                f"fontColor=#0F172A;labelBackgroundColor=#FFFFFF;labelBorderColor={stroke_color};"
                f"exitX={src_pt[0]};exitY={src_pt[1]};entryX={dst_pt[0]};entryY={dst_pt[1]};"
            ),
            "edge": "1",
            "parent": "1",
            "source": src,
            "target": dst
        })
        ET.SubElement(edge, "mxGeometry", {"relative": "1", "as": "geometry"})

    # 1. CATEGORIES (1) -> PRODUCTS (N)
    add_rel("rel_cat_prod", "1 : N (categorizes)", "tbl_categories", "tbl_products", (1.0, 0.35), (0.0, 0.35), "#4F46E5")

    # 2. CUSTOMERS (1) -> ORDERS (N)
    add_rel("rel_cust_ord", "1 : N (places)", "tbl_customers", "tbl_orders", (0.5, 1.0), (0.5, 0.0), "#059669")

    # 3. ORDERS (1) -> ORDER_ITEMS (N)
    add_rel("rel_ord_items", "1 : N (contains)", "tbl_orders", "tbl_order_items", (0.0, 0.4), (1.0, 0.4), "#0284C7")

    # 4. PRODUCTS (1) -> ORDER_ITEMS (N)
    add_rel("rel_prod_items", "1 : N (ordered_in)", "tbl_products", "tbl_order_items", (0.5, 1.0), (0.5, 0.0), "#D97706")

    # Generate XML
    xml_str = ET.tostring(mxfile, encoding="utf-8", method="xml").decode("utf-8")
    
    with open("ecommerce_erd.drawio", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
    print("Wrote clean ecommerce_erd.drawio")
    
    with open("public/ecommerce_erd.drawio", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
    print("Wrote clean public/ecommerce_erd.drawio")

if __name__ == "__main__":
    generate_clean_erd()
