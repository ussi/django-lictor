# coding: utf-8
import settings

DEBUG = True
INTERCEPT_REDIRECTS = False
TEMPLATE_DEBUG = DEBUG
DEBUG_TOOLBAR = True

LANGUAGE_CODE = 'en'

INSTALLED_APPS = settings.INSTALLED_APPS + (
    'cpserver',
    'south',
    'debug_toolbar',
)

CUSTOM_MIDDLEWARE_CLASSES = tuple()
if DEBUG_TOOLBAR:
    CUSTOM_MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
MIDDLEWARE_CLASSES = CUSTOM_MIDDLEWARE_CLASSES + settings.MIDDLEWARE_CLASSES

DEBUG_TOOLBAR_CONFIG = {
    'INTERCEPT_REDIRECTS': INTERCEPT_REDIRECTS,
    'SHOW_TOOLBAR_CALLBACK': lambda request: True,
    'ENABLE_STACKTRACES': True,
    'HIDE_DJANGO_SQL': False,
    # 'EXTRA_SIGNALS': ['kinsburg_tv.common.signals.MySignal'],
    # 'TAG': 'div',
}
DEBUG_TOOLBAR_PANELS = (
    'debug_toolbar.panels.version.VersionDebugPanel',
    'debug_toolbar.panels.timer.TimerDebugPanel',
    'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
    'debug_toolbar.panels.headers.HeaderDebugPanel',
    # 'debug_toolbar.panels.profiling.ProfilingDebugPanel',
    # 'debug_toolbar.panels.profiling_plus.ProfilingDebugPanel',
    'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
    'debug_toolbar.panels.sql.SQLDebugPanel',
    'debug_toolbar.panels.template.TemplateDebugPanel',
    'debug_toolbar.panels.cache.CacheDebugPanel',
    'debug_toolbar.panels.signals.SignalDebugPanel',
    'debug_toolbar.panels.logger.LoggingPanel',
)
