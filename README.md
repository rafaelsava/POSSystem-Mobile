# 🍽️ App de Pedidos para Restaurante

Aplicación móvil para gestionar pedidos en un entorno de restaurante. Los usuarios pueden ser clientes, chefs o cajeros, y cada uno tiene flujos de interacción específicos para facilitar el proceso desde la orden hasta el pago.

## 🧰 Tecnologías Utilizadas

- **React Native (Expo)** – Interfaz móvil multiplataforma.  
- **Firebase (Auth + Firestore)** – Autenticación y almacenamiento de datos en tiempo real.  
- **TypeScript** – Seguridad de tipos en el desarrollo.  
- **Context API** – Manejo centralizado del estado global de la app.

## 👥 Integrantes del Proyecto

- Rafael Salcedo  
- Fermín Escalona

---

## 🔄 Flujos del Usuario

### 👨‍🍳 Cliente

1. **Ver Menú y Agregar al Carrito**
   - El cliente visualiza todos los productos disponibles.
   - Puede agregar productos al carrito, ajustar cantidades y eliminarlos.
   - Al finalizar, envía la orden directamente a cocina.

2. **Ver Estado del Pedido**
   - El cliente puede consultar el estado de su orden en cualquier momento.
   - Estados posibles: `Ordered`, `Cooking`, `Ready for Pickup`, `Delivered`, `Ready for Payment`.

---

### 🍳 Chef

3. **Recibir Pedidos**
   - Recibe órdenes nuevas en tiempo real.
   - Puede visualizar los detalles y productos de cada orden.

4. **Actualizar Estado**
   - Cambia el estado del pedido a `Cooking` o `Ready for Pickup`.
   - Cada cambio se refleja automáticamente en la vista del cliente.

---

### 💵 Cajero

5. **Ver Todas las Órdenes**
   - Panel con todas las órdenes activas y sus detalles.
   - Permite filtrar por estado (como "Ready for Payment").

6. **Cobrar y Marcar como Pagado**
   - Visualiza un resumen detallado de la orden: subtotal, impuestos, total.
   - Marca la orden como `Paid` al recibir el pago.
   - Genera un recibo.

---

## 📂 Estructura del Proyecto

- `app/client/` – Pantallas y lógica para clientes.  
- `app/chef/` – Interfaz para la cocina.  
- `app/cashier/` – Pantallas para cajeros.  
- `context/` – Contextos para el manejo de estado global.  
- `utils/` – Configuración de Firebase y herramientas auxiliares.

---

## ▶️ Cómo Ejecutar

```bash
npm install
npx expo start
