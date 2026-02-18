import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const localDb = {
  async query(text: string, params?: any[]) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  async getRecentStockIn() {
    const result = await this.query(`
      SELECT sm.*, p.name as product_name 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      WHERE sm.movement_type = 'IN'
      ORDER BY sm.created_at DESC
      LIMIT 5
    `);
    return result.rows;
  },

  async getLowStockCount() {
    const result = await this.query(`
      SELECT COUNT(*) as count
      FROM products
      WHERE stock_quantity <= reorder_level
    `);
    return parseInt(result.rows[0].count);
  },

  async getUserByEmail(email: string) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }
};