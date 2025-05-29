/**
 * @openapi
 * /getCoordinate/{id}:
 *   get:
 *     summary: Retorna uma coordenada favorita por ID
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da coordenada favorita
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coordenada retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coordinates:
 *                   type: object
 *                   $ref: '#/components/schemas/Coordinate'
 *       500:
 *         description: Erro interno ao buscar a coordenada
 */

/**
 * @openapi
 * /getAllCoordinates:
 *   get:
 *     summary: Retorna todas as coordenadas favoritas do usuário autenticado
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de coordenadas favoritas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coordinates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FavoriteListResponse'
 *       401:
 *         description: Usuário não autorizado
 *       500:
 *         description: Erro interno ao buscar coordenadas
 */

/**
 * @openapi
 * /addFavorite:
 *   post:
 *     summary: Adiciona uma nova coordenada favorita
 *     tags:
 *       - Favorites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Coordenada adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Coordinate successfully added!!
 *       401:
 *         description: Usuário não autorizado
 *       500:
 *         description: Erro interno ao adicionar coordenada
 */

/**
 * @openapi
 * /favorites/{id}:
 *   delete:
 *     summary: Deleta uma coordenada favorita pelo ID
 *     tags:
 *       - Favorites
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da coordenada favorita
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coordenada deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCoordinate:
 *                   $ref: '#/components/schemas/Coordinate'
 *       404:
 *         description: Coordenada não encontrada
 *       500:
 *         description: Erro interno ao deletar coordenada
 */



