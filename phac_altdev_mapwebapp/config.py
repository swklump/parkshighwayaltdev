def get_config_dict():
    
    config_dict = {
        'SECRET_KEY':'wr%l%3@tz)-esuulm7hty%ap(_g0)tve6k*h^@6b-c-_7-ne#p',

        'DATABASES_PROD': {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'phacaltdev',
                'USER': 'swklump',
                'PASSWORD':'AnhCSuRVEy2O21',
                'HOST':'swklump-2473.postgres.pythonanywhere-services.com',
                'PORT':'12473',
            }
        },

        'DATABASES_LOCAL': {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': 'PHAC Alt Dev',
                'USER': 'postgres',
                'PASSWORD':'Thinktank12',
                'HOST':'localhost',
                'PORT':'5432',
            }
        }
    }

    return config_dict