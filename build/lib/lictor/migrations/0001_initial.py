# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Trace'
        db.create_table('lictor_trace', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('session', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('json', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('lictor', ['Trace'])


    def backwards(self, orm):
        # Deleting model 'Trace'
        db.delete_table('lictor_trace')


    models = {
        'lictor.trace': {
            'Meta': {'object_name': 'Trace'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'json': ('django.db.models.fields.TextField', [], {}),
            'session': ('django.db.models.fields.PositiveIntegerField', [], {})
        }
    }

    complete_apps = ['lictor']