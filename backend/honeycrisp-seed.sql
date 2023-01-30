-- yukiho valorant
-- zenniboi lostark
-- mudkrep lostark
INSERT INTO
    users (
        username,
        password,
        first_name,
        last_name,
        phone,
        photo,
        is_admin,
        created_at
    )
VALUES
    (
        'yukiho',
        'valorant',
        'George',
        'Weng',
        '123-456-7890',
        'https://cdn.discordapp.com/emojis/772890337873362955.webp?size=160&quality=lossless',
        TRUE,
        NOW()
    ),
    (
        'zenniboi',
        'lostark',
        'Zhen',
        'Teoh',
        '123-456-7890',
        'https://cdn.discordapp.com/emojis/778696399952019485.webp?size=160&quality=lossless',
        FALSE,
        NOW()
    ),
    (
        'mudkrep',
        'lostark',
        'Charles',
        'Pan',
        '123-456-7890',
        'https://cdn.discordapp.com/emojis/772890124400590849.webp?size=160&quality=lossless',
        FALSE,
        NOW()
    );

INSERT INTO
    sessions (title, description, host)
VALUES
    ('McDonalds', 'A little snack', 1),
    ('Starbucks', 'Necessity', 3);

INSERT INTO
    items (name, price)
VALUES
    ('Big Mac', 3.99),
    ('Coke', 1.99),
    ('Large Fries', 2.99),
    ('Latte', 3.99),
    ('Muffin', 2.99);

INSERT INTO
    sessions_users (session_id, user_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 3),
    (2, 2);

INSERT INTO
    sessions_items (session_id, item_id)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 3),
    (2, 4);

INSERT INTO
    sessions_items_ate (session_id, item_id, user_id)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (1, 3, 1),
    (1, 3, 2),
    (1, 3, 3);