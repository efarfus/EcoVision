/**
 * @openapi
 * /users:
 *   get:
 *     summary: Descrição do endpoint
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Sucesso na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserListResponse'
 */

/**
 * @openapi
 * /users/token:
 *   get:
 *     summary: Busca usuário pelo token
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Sucesso na requisição
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Criar novo usuário
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: 
 *                   type: string
 */

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Criar novo usuário
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: 
 *                   type: string
 */


/**
 * @openapi
 * /users/update:
 *   put:
 *     summary: Atualiza um usuário existente
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                password:
 *                  type: string
 *                email:
 *                   type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */

/**
 * @openapi
 * /users/{userID}/delete:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */