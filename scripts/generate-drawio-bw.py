import os
import xml.etree.ElementTree as ET

def generate_simple_bw_erd():
    mxfile = ET.Element("mxfile", {
        "host": "app.diagrams.net",
        "modified": "2026-11-22T14:55:00.000Z",
        "agent": "Mozilla/5.0",
        "version": "24.0.0",
        "type": "device"
    })
    
    diagram = ET.SubElement(mxfile, "diagram", {
        "id": "EcommerceERD_BW",
        "name": "E-Commerce ERD"
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
        "pageWidth": "1200",
        "pageHeight": "850",
        "background": "#ffffff",
        "math": "0",
        "shadow": "0"
    })
    
    root = ET.SubElement(model, "root")
    ET.SubElement(root, "mxCell", {"id": "0"})
    ET.SubElement(root, "mxCell", {"id": "1", "parent": "0"})

    # Helper to add standard B&W table swimlane
    def add_table(table_id, name, x, y, width, columns):
        header_height = 32
        row_height = 24
        total_height = header_height + (len(columns) * row_height)
        
        # Table swimlane: white fill, black border, default Helvetica font
        table = ET.SubElement(root, "mxCell", {
            "id": table_id,
            "value": f"<b>{name}</b>",
            "style": (
                f"swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;"
                f"horizontal=1;startSize={header_height};horizontalStack=0;resizeParent=1;resizeParentMax=0;"
                f"resizeLast=0;collapsible=0;marginBottom=0;html=1;whiteSpace=wrap;"
                f"fillColor=#ffffff;strokeColor=#000000;strokeWidth=1.5;fontColor=#000000;"
                f"fontFamily=Helvetica;fontSize=13;"
            ),
            "vertex": "1",
            "parent": "1"
        })
        ET.SubElement(table, "mxGeometry", {"x": str(x), "y": str(y), "width": str(width), "height": str(total_height), "as": "geometry"})
        
        for i, col in enumerate(columns):
            row_id = f"{table_id}_col_{i}"
            key_tag = col[0]
            field_name = col[1]
            data_type = col[2]
            
            if key_tag:
                row_val = f"<b>{key_tag}</b> &nbsp; {field_name} : {data_type}"
            else:
                row_val = f"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {field_name} : {data_type}"
                
            row = ET.SubElement(root, "mxCell", {
                "id": row_id,
                "value": row_val,
                "style": (
                    "text;strokeColor=none;fillColor=#ffffff;align=left;verticalAlign=middle;"
                    "spacingLeft=8;spacingRight=8;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];"
                    "portConstraint=eastwest;whiteSpace=wrap;html=1;fontFamily=Helvetica;fontSize=11;fontColor=#000000;"
                ),
                "vertex": "1",
                "parent": table_id
            })
            ET.SubElement(row, "mxGeometry", {"y": str(header_height + (i * row_height)), "width": str(width), "height": str(row_height), "as": "geometry"})

    # 1. CATEGORIES (Top Left)
    categories_cols = [
        ("PK", "id", "INTEGER"),
        ("UK", "name", "TEXT"),
        ("UK", "slug", "TEXT"),
        ("", "description", "TEXT"),
        ("", "createdAt", "DATETIME"),
        ("", "updatedAt", "DATETIME")
    ]
    add_table("tbl_categories", "CATEGORIES", 50, 80, 260, categories_cols)

    # 2. PRODUCTS (Top Center)
    products_cols = [
        ("PK", "id", "INTEGER"),
        ("", "name", "TEXT"),
        ("UK", "slug", "TEXT"),
        ("", "description", "TEXT"),
        ("", "price", "REAL"),
        ("", "imageUrl", "TEXT"),
        ("", "stock", "INTEGER"),
        ("FK", "categoryId", "INTEGER"),
        ("", "createdAt", "DATETIME"),
        ("", "updatedAt", "DATETIME")
    ]
    add_table("tbl_products", "PRODUCTS", 410, 80, 280, products_cols)

    # 3. CUSTOMERS (Top Right)
    customers_cols = [
        ("PK", "id", "INTEGER"),
        ("", "firstName", "TEXT"),
        ("", "lastName", "TEXT"),
        ("UK", "email", "TEXT"),
        ("", "phone", "TEXT"),
        ("", "address", "TEXT"),
        ("", "city", "TEXT"),
        ("", "state", "TEXT"),
        ("", "zipCode", "TEXT"),
        ("", "createdAt", "DATETIME"),
        ("", "updatedAt", "DATETIME")
    ]
    add_table("tbl_customers", "CUSTOMERS", 790, 80, 270, customers_cols)

    # 4. ORDER_ITEMS (Bottom Center)
    order_items_cols = [
        ("PK", "id", "INTEGER"),
        ("FK", "orderId", "INTEGER"),
        ("FK", "productId", "INTEGER"),
        ("", "quantity", "INTEGER"),
        ("", "price", "REAL"),
        ("", "total", "REAL"),
        ("", "createdAt", "DATETIME")
    ]
    add_table("tbl_order_items", "ORDER_ITEMS", 410, 420, 280, order_items_cols)

    # 5. ORDERS (Bottom Right)
    orders_cols = [
        ("PK", "id", "INTEGER"),
        ("UK", "orderNumber", "TEXT"),
        ("FK", "customerId", "INTEGER"),
        ("", "status", "TEXT"),
        ("", "subtotal", "REAL"),
        ("", "shippingMethod", "TEXT"),
        ("", "shippingCost", "REAL"),
        ("", "tax", "REAL"),
        ("", "total", "REAL"),
        ("", "createdAt", "DATETIME"),
        ("", "updatedAt", "DATETIME")
    ]
    add_table("tbl_orders", "ORDERS", 790, 420, 270, orders_cols)

    # Simple clean black connectors
    def add_rel(edge_id, label, src, dst, src_pt, dst_pt):
        edge = ET.SubElement(root, "mxCell", {
            "id": edge_id,
            "value": f"<b>{label}</b>",
            "style": (
                "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
                "startArrow=ERone;startFill=0;endArrow=ERmany;endFill=0;strokeWidth=1.5;strokeColor=#000000;"
                "fontColor=#000000;fontFamily=Helvetica;fontSize=11;labelBackgroundColor=#ffffff;labelBorderColor=#000000;"
                f"exitX={src_pt[0]};exitY={src_pt[1]};entryX={dst_pt[0]};entryY={dst_pt[1]};"
            ),
            "edge": "1",
            "parent": "1",
            "source": src,
            "target": dst
        })
        ET.SubElement(edge, "mxGeometry", {"relative": "1", "as": "geometry"})

    # Connectors
    add_rel("rel_cat_prod", "1 : N", "tbl_categories", "tbl_products", (1.0, 0.35), (0.0, 0.35))
    add_rel("rel_cust_ord", "1 : N", "tbl_customers", "tbl_orders", (0.5, 1.0), (0.5, 0.0))
    add_rel("rel_ord_items", "1 : N", "tbl_orders", "tbl_order_items", (0.0, 0.4), (1.0, 0.4))
    add_rel("rel_prod_items", "1 : N", "tbl_products", "tbl_order_items", (0.5, 1.0), (0.5, 0.0))

    # Write files
    xml_str = ET.tostring(mxfile, encoding="utf-8", method="xml").decode("utf-8")
    
    with open("ecommerce_erd.drawio", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
        
    with open("public/ecommerce_erd.drawio", "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n' + xml_str)
        
    print("Generated simple Black & White ecommerce_erd.drawio successfully!")

if __name__ == "__main__":
    generate_simple_bw_erd()
