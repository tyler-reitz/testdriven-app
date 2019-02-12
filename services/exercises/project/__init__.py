# project/__init__.py


import os

from flask import Flask
from flask_cors import CORS
from flask_debugtoolbar import DebugToolbarExtension


# instantiate the extensions
toolbar = DebugToolbarExtension()
cors = CORS()


def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)

    # set up extensions
    toolbar.init_app(app)
    cors.init_app(app)

    # register blueprints
    from project.api.base import base_blueprint
    app.register_blueprint(base_blueprint)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {'app': app}

    return app
