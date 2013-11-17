# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Trace.session'
        db.alter_column('lictor_trace', 'session', self.gf('django.db.models.fields.BigIntegerField')())

    def backwards(self, orm):

        # Changing field 'Trace.session'
        db.alter_column('lictor_trace', 'session', self.gf('django.db.models.fields.PositiveIntegerField')())

    models = {
        'lictor.trace': {
            'Meta': {'object_name': 'Trace'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'json': ('django.db.models.fields.TextField', [], {}),
            'session': ('django.db.models.fields.BigIntegerField', [], {})
        }
    }

    complete_apps = ['lictor']