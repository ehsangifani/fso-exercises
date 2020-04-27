Cypress.Commands.add('login', ({ username, password }) => {
	cy.request('POST', 'http://localhost:3001/api/login', {
		username, password
	}).then(({ body }) => {
		localStorage.setItem('loggedBlogappUser', JSON.stringify(body));
		cy.visit('http://localhost:3000');
	});
});

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
	cy.request({
		url: 'http://localhost:3001/api/blogs',
		method: 'POST',
		body: { title, author, url },
		headers: {
			'Authorization': `bearer ${JSON.parse(
				localStorage.getItem('loggedBlogappUser')).token}`
		},
	});

	cy.visit('http://localhost:3000');
});

describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset');
		const user = {
			name: 'Matti Luukkainen',
			username: 'mluukkai',
			password: 'salainen'
		};
		cy.request('POST', 'http://localhost:3001/api/users', user);
		cy.visit('http://localhost:3000');
	});

	it('Login form is shown', function () {
		cy.get('form').find('input[name="Username"]');
		cy.get('form').find('input[name="Password"]');
		cy.get('form').find('button').should('contain', 'login');
		cy.get('html').should('not.contain', 'new note');
	});

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('input[name="Username"]').parents('form').as('Form');
			cy.get('@Form').find('input[name="Username"]').type('mluukkai');
			cy.get('@Form').find('input[name="Password"]').type('salainen');
			cy.get('@Form').find('button').click();
			cy.contains('Matti Luukkainen logged in');
		});

		it('fails with wrong credentials', function () {
			cy.get('input[name="Username"]').parents('form').as('Form');
			cy.get('@Form').find('input[name="Username"]').type('mluukkai');
			cy.get('@Form').find('input[name="Password"]').type('wrong');
			cy.get('@Form').find('button').click();
			cy.get('.notification-error')
				.should('contain', 'invalid username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid');
			cy.get('html').should('not.contain', 'Matti Luukkainen logged in');
		});
	});

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'mluukkai', password: 'salainen' });
		});

		it('A blog can be created', function () {
			cy.contains('new note').click();
			cy.get('input[name="Title"]').parents('form').as('Form');
			cy.get('@Form').find('input[name="Title"]').type('Test-title');
			cy.get('@Form').find('input[name="Author"]').type('Test-author');
			cy.get('@Form').find('input[name="Url"]').type('Test-url');
			cy.get('@Form').find('button').contains('create').click();
			cy.get('.notification-success');
			cy.get('.blog-entry')
				.filter(':contains("Test-title")')
				.filter(':contains("Test-author")')
				.find('button').contains('view');
		});

		describe('and user has added a blog', function () {
			beforeEach(function () {
				cy.createBlog({
					title: 'testing another blog cypress',
					author: 'testing another author',
					url: 'testing another url'
				});
			});

			it('blog can be liked', function () {
				cy.get('.blog-entry').first().as('toLike');
				cy.get('@toLike').contains('view').click();
				cy.get('@toLike').contains('button', 'like').click();
				cy.get('@toLike').find('.likes').contains('1');
			});

			it('blog can be deleted', function () {
				cy.get('.blog-entry').first().as('toDelete');
				cy.get('@toDelete').contains('view').click();
				cy.get('@toDelete').contains('button', 'remove').click();
				cy.on('window:confirm', () => true);
				cy.get('.blog-entry').should('not.exist');
			});

			describe('another user logs in', function () {
				beforeEach(function () {
					const user = {
						name: 'Arto Hellas',
						username: 'hellas',
						password: 'salainen'
					};
					cy.request('POST', 'http://localhost:3001/api/users', user);
					cy.login({ username: 'hellas', password: 'salainen' });
				});
				it('and can also like it', function () {
					cy.get('.blog-entry').first().as('toLike');
					cy.get('@toLike').contains('view').click();
					cy.get('@toLike').contains('button', 'like').click();
					cy.get('@toLike').find('.likes').contains('1');
				});
				it('but cannot delete it', function () {
					cy.get('.blog-entry').first().as('toLike');
					cy.get('@toLike').contains('view').click();
					cy.get('@toLike').contains('button', 'remove')
						.should('not.exist');
				});
			});

		});

		describe('And there are multiple blogs', function () {
			beforeEach(function () {
				const headers = {
					'Authorization': `bearer ${JSON.parse(
						localStorage.getItem('loggedBlogappUser')).token}`
				};
				for (let i = 0; i < 5; i++) {
					cy.request({
						url: 'http://localhost:3001/api/blogs',
						method: 'POST',
						body: {
							title: `blog-${i} title`,
							author: `blog-${i} author`,
							url: `blog-${i} url`,
							likes: i
						},
						headers,
					});
				}
				cy.visit('http://localhost:3000');
			});

			it('ordered by likes with highest shown first', function () {
				cy.get('.blog-entry').each($div => {
					cy.wrap($div).contains('view').click();
				});
				cy.get('.blog-entry').then($divs => {
					expect($divs).to.have.length(5);
					const likes = $divs.map((_, el) => {
						return Cypress.$(el).find('.likes').text();
					});
					expect(likes.get()).to.deep.eq(['4', '3', '2', '1', '0']);
				});
			});
		});
	});
});